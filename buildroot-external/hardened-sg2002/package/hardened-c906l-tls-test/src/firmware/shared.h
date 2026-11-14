/* SPDX-License-Identifier: MIT */
/* Layout and messages shared by the C906L test firmware and the Linux test module. */
#ifndef C906L_TLS_SHARED_H
#define C906L_TLS_SHARED_H

#define C9_REGION_BASE 0x8fe00000UL
#define C9_REGION_SIZE 0x200000UL
#define C9_FW_MAX 0x40000UL /* code, data and stack */

/* Offsets from the region base. Each block starts on its own cache line. */
#define C9_STATUS_OFF 0x40000UL /* written by the firmware */
#define C9_COOKIE_OFF 0x40040UL /* written by Linux before release */
#define C9_BELL_OFF 0x40080UL /* struct c9_bell, written by Linux in poll mode */
#define C9_SLOT_OFF 0x41000UL
#define C9_REQ_SIZE 64 /* struct c9_req, written by Linux */
#define C9_RES_OFF 64 /* struct c9_res, written by the firmware */
#define C9_IN_OFF 128
#define C9_MAX_LEN 16640
#define C9_TAG_LEN 16
#define C9_OUT_OFF (C9_IN_OFF + C9_MAX_LEN)
#define C9_SLOT_END (C9_OUT_OFF + C9_MAX_LEN + 64)

#define C9_STATUS_MAGIC 0x4c543943U /* "C9TL" */
#define C9_VERSION 1

/* Mailbox: Linux is CPU 1, the C906L CPU 2. */
#define C9_MBOX_BASE 0x01900000UL
#define C9_CH_REQ 2 /* Linux -> C906L */
#define C9_CH_RES 3 /* C906L -> Linux */

/* 8-byte message: magic, op, slot or status, flags, then a 32-bit sequence number. */
#define C9_MSG_REQ 0xC9
#define C9_MSG_RES 0x9C
#define C9_OP_PING 1
#define C9_OP_COPY 2
#define C9_OP_SEAL 3
/* Poll mode skips the mailbox both ways: request through the doorbell line, answer in the
 * result line. */
#define C9_FLAG_POLL 1

#define C9_ST_OK 0
#define C9_ST_BAD_OP 1
#define C9_ST_BAD_LEN 2

struct c9_status {
	unsigned int magic;
	unsigned int version;
	unsigned int cookie;
	unsigned int messages;
	unsigned long mhcr;
	unsigned long mxstatus;
	unsigned long mhint;
	unsigned long loops;
	unsigned char pad[16];
};

struct c9_bell {
	unsigned int seq;
	unsigned int msg; /* the low word of a mailbox message */
	unsigned char pad[56];
};

struct c9_req {
	unsigned char key[32];
	unsigned char nonce[12];
	unsigned int len;
	unsigned char aad[13];
	unsigned char aad_len;
	unsigned char pad[2];
};

struct c9_res {
	unsigned int seq;
	unsigned int status;
	unsigned long cycles; /* mcycle across the operation */
	unsigned long ticks; /* rdtime (25 MHz) across the operation */
	unsigned char pad[40];
};

#endif
