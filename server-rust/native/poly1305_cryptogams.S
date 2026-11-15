/* CRYPTOGAMS Poly1305 (poly1305-riscv.pl from Linux 6.18, unchanged; build.rs generates
 * poly1305-riscv64.S from it) under our own names, with 64-bit misaligned loads: the C906
 * does them in hardware. */
#define __riscv_misaligned_fast 1
#define poly1305_init hnk_poly1305_init
#define poly1305_blocks hnk_poly1305_blocks
#define poly1305_emit hnk_poly1305_emit
#include "poly1305-riscv64.S"
