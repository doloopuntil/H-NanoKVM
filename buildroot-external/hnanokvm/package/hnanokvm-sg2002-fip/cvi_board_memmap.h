/* LicheeRV Nano memory map for the FSBL, from the SDK's sg2002_licheervnano_sd/memmap.py
 * (sipeed/LicheeRV-Nano-Build d88d58fe). Only what our BL2 build reads. */
#ifndef __BOARD_MMAP_SG2002_LICHEERVNANO__
#define __BOARD_MMAP_SG2002_LICHEERVNANO__

#define CVIMMAP_DRAM_BASE 0x80000000  /* offset 0.0KiB */
#define CVIMMAP_DRAM_SIZE 0x10000000  /* 256.0MiB */
#define CVIMMAP_FSBL_C906L_START_ADDR 0x8fe00000  /* offset 254.0MiB */
#define CVIMMAP_FSBL_UNZIP_ADDR 0x81800000  /* offset 24.0MiB */
#define CVIMMAP_FSBL_UNZIP_SIZE 0x1000000  /* 16.0MiB */
#define CVIMMAP_MONITOR_ADDR 0x80000000  /* offset 0.0KiB */
#define CVIMMAP_OPENSBI_FDT_ADDR 0x80080000  /* offset 512.0KiB */

#endif /* __BOARD_MMAP_SG2002_LICHEERVNANO__ */
