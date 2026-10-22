// Replacements for the closed libisp pieces the LT6911 path needs.
#include "global_config.h"

#include <errno.h>
#include <fcntl.h>
#include <pthread.h>
#include <stdio.h>
#include <string.h>
#include <sys/ioctl.h>
#include <unistd.h>

#include <linux/cif_uapi.h>
#include "cvi_comm_sns.h"
#include "cvi_isp.h"
#include "cvi_sns_ctrl.h"
#include "lt6911_cmos_ex.h"
#include "lt6911_cmos_param.h"

#define KVM_MIPI_DEV "/dev/cvi-mipi-rx"
#define KVM_MIPI_MAX_PIPE 5

// Same ioctl size as libisp uses (0x40c06d01).
_Static_assert(sizeof(struct combo_dev_attr_s) == 0xc0, "combo_dev_attr_s ABI");

static int mipi_fd = -1;
static pthread_mutex_t mipi_lock = PTHREAD_MUTEX_INITIALIZER;

static int mipi_ioctl(unsigned long cmd, void *arg)
{
	int fd;

	pthread_mutex_lock(&mipi_lock);
	if (mipi_fd < 0)
		mipi_fd = open(KVM_MIPI_DEV, O_RDWR | O_CLOEXEC);
	fd = mipi_fd;
	pthread_mutex_unlock(&mipi_lock);
	if (fd < 0) {
		fprintf(stderr, "open %s: %s\n", KVM_MIPI_DEV, strerror(errno));
		return CVI_FAILURE;
	}
	if (ioctl(fd, cmd, arg) < 0) {
		fprintf(stderr, "mipi ioctl %#lx: %s\n", cmd, strerror(errno));
		return CVI_FAILURE;
	}
	return CVI_SUCCESS;
}

CVI_S32 CVI_MIPI_SetMipiReset(CVI_S32 devno, CVI_U32 reset)
{
	unsigned int dev = devno;

	return mipi_ioctl(reset ? CVI_MIPI_RESET_MIPI : CVI_MIPI_UNRESET_MIPI, &dev);
}

CVI_S32 CVI_MIPI_SetSensorReset(CVI_S32 devno, CVI_U32 reset)
{
	unsigned int dev = devno;

	return mipi_ioctl(reset ? CVI_MIPI_RESET_SENSOR : CVI_MIPI_UNRESET_SENSOR, &dev);
}

CVI_S32 CVI_MIPI_SetSensorClock(CVI_S32 devno, CVI_U32 enable)
{
	unsigned int dev = devno;

	return mipi_ioctl(enable ? CVI_MIPI_ENABLE_SENSOR_CLOCK : CVI_MIPI_DISABLE_SENSOR_CLOCK, &dev);
}

CVI_S32 CVI_MIPI_SetMipiAttr(CVI_S32 ViPipe, const CVI_VOID *devAttr)
{
	if (ViPipe < 0 || ViPipe > KVM_MIPI_MAX_PIPE || devAttr == CVI_NULL)
		return CVI_FAILURE;
	return mipi_ioctl(CVI_MIPI_SET_DEV_ATTR, (void *)devAttr);
}

CVI_S32 CVI_MIPI_SetClkEdge(CVI_S32 devno, CVI_U32 is_up)
{
	struct clk_edge_s edge = {
		.devno = devno,
		.edge = is_up ? CLK_UP_EDGE : CLK_DOWN_EDGE,
	};

	return mipi_ioctl(CVI_MIPI_SET_OUTPUT_CLK_EDGE, &edge);
}

// libvi references it from its register-dump debug code only.
CVI_S32 CVI_ISP_GetVDTimeOut(VI_PIPE ViPipe, ISP_VD_TYPE_E enIspVDType, CVI_U32 u32MilliSec)
{
	(void)ViPipe;
	(void)enIspVDType;
	(void)u32MilliSec;
	return CVI_FAILURE;
}

// libcvi_bin's PQ bin state, used by libvpss. No bin is ever loaded here.
CVI_BOOL get_loadbin_state(void)
{
	return CVI_FALSE;
}

void *get_vpssbindata_addr(void)
{
	return CVI_NULL;
}

// LT6911 sensor object without ISP/AE/AWB callbacks; replaces lt6911_cmos.c.
static CVI_S32 lt6911_get_sns_regs_info(VI_PIPE ViPipe, ISP_SNS_SYNC_INFO_S *info)
{
	(void)ViPipe;
	if (info == CVI_NULL)
		return CVI_FAILURE;
	info->ispCfg.frm_num = 1;
	info->ispCfg.img_size[0] = g_astLt6911_mode[LT6911_MODE_NORMAL].astImg[0];
	return CVI_SUCCESS;
}

static CVI_S32 lt6911_set_image_mode(VI_PIPE ViPipe, ISP_CMOS_SENSOR_IMAGE_MODE_S *mode)
{
	(void)ViPipe;
	return mode ? CVI_SUCCESS : CVI_FAILURE;
}

static CVI_S32 lt6911_set_wdr_mode(VI_PIPE ViPipe, CVI_U8 u8Mode)
{
	(void)ViPipe;
	(void)u8Mode;
	return CVI_SUCCESS;
}

static CVI_VOID lt6911_global_init(VI_PIPE ViPipe)
{
	(void)ViPipe;
}

static CVI_S32 lt6911_exp_sensor_cb(ISP_SENSOR_EXP_FUNC_S *funcs)
{
	if (funcs == CVI_NULL)
		return CVI_FAILURE;
	memset(funcs, 0, sizeof(*funcs));
	funcs->pfn_cmos_sensor_init = lt6911_init;
	funcs->pfn_cmos_sensor_exit = lt6911_exit;
	funcs->pfn_cmos_sensor_global_init = lt6911_global_init;
	funcs->pfn_cmos_set_image_mode = lt6911_set_image_mode;
	funcs->pfn_cmos_set_wdr_mode = lt6911_set_wdr_mode;
	funcs->pfn_cmos_get_sns_reg_info = lt6911_get_sns_regs_info;
	return CVI_SUCCESS;
}

static CVI_S32 lt6911_rx_attr_get(VI_PIPE ViPipe, SNS_COMBO_DEV_ATTR_S *attr)
{
	(void)ViPipe;
	if (attr == CVI_NULL)
		return CVI_FAILURE;
	*attr = lt6911_rx_attr;
	// lt6911_cmos.c reads mode 0, which is empty: the size goes out as 0x0.
	attr->img_size.width = g_astLt6911_mode[0].astImg[LT6911_MODE_NORMAL].stSnsSize.u32Width;
	attr->img_size.height = g_astLt6911_mode[0].astImg[LT6911_MODE_NORMAL].stSnsSize.u32Height;
	return CVI_SUCCESS;
}

static CVI_S32 lt6911_patch_rx_attr(RX_INIT_ATTR_S *init)
{
	struct combo_dev_attr_s *attr = &lt6911_rx_attr;

	if (init == CVI_NULL)
		return CVI_FAILURE;
	if (init->stMclkAttr.bMclkEn)
		attr->mclk.cam = init->stMclkAttr.u8Mclk;
	if (init->MipiDev >= 2)
		return CVI_SUCCESS;
	attr->devno = init->MipiDev;
	for (int i = 0; i < MIPI_LANE_NUM + 1; i++) {
		if (attr->input_mode == INPUT_MODE_MIPI) {
			attr->mipi_attr.lane_id[i] = init->as16LaneId[i];
			attr->mipi_attr.pn_swap[i] = init->as8PNSwap[i];
		} else {
			attr->lvds_attr.lane_id[i] = init->as16LaneId[i];
			attr->lvds_attr.pn_swap[i] = init->as8PNSwap[i];
		}
	}
	return CVI_SUCCESS;
}

static CVI_S32 lt6911_set_bus_info(VI_PIPE ViPipe, ISP_SNS_COMMBUS_U bus)
{
	(void)ViPipe;
	(void)bus;
	return CVI_SUCCESS;
}

static CVI_S32 lt6911_set_init(VI_PIPE ViPipe, ISP_INIT_ATTR_S *init)
{
	(void)ViPipe;
	(void)init;
	return CVI_SUCCESS;
}

ISP_SNS_OBJ_S stSnsLT6911_Obj = {
	.pfnRegisterCallback = CVI_NULL,
	.pfnUnRegisterCallback = CVI_NULL,
	.pfnStandby = CVI_NULL,
	.pfnRestart = CVI_NULL,
	.pfnMirrorFlip = CVI_NULL,
	.pfnWriteReg = lt6911_write,
	.pfnReadReg = lt6911_read,
	.pfnSetBusInfo = lt6911_set_bus_info,
	.pfnSetInit = lt6911_set_init,
	.pfnPatchRxAttr = lt6911_patch_rx_attr,
	.pfnPatchI2cAddr = CVI_NULL,
	.pfnGetRxAttr = lt6911_rx_attr_get,
	.pfnExpSensorCb = lt6911_exp_sensor_cb,
	.pfnExpAeCb = CVI_NULL,
	.pfnSnsProbe = lt6911_probe,
};
