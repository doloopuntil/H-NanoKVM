// Prints libqr's 29x29 matrix for each stdin line, encoded as kvm_system does
// (qrInit(3, QR_EM_8BIT, 1, 4)): "#" dark, "." light; "ERROR" if it does not fit.
#include <stdio.h>
#include <string.h>
#include "qr.h"

int main(void)
{
	char line[256];
	while (fgets(line, sizeof(line), stdin)) {
		line[strcspn(line, "\n")] = 0;
		int err = QR_ERR_NONE;
		QRCode *qr = qrInit(3, QR_EM_8BIT, 1, 4, &err);
		printf("> %s\n", line);
		if (!qr || !qrAddData(qr, (const qr_byte_t *)line, (int)strlen(line)) || !qrFinalize(qr)) {
			printf("ERROR\n");
			if (qr) qrDestroy(qr);
			continue;
		}
		for (int i = 0; i < 29; i++) {
			for (int j = 0; j < 29; j++) putchar(qrIsBlacke(qr, i, j) ? '#' : '.');
			putchar('\n');
		}
		qrDestroy(qr);
	}
	return 0;
}
