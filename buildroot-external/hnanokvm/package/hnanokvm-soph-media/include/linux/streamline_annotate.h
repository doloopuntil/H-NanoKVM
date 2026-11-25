/* SPDX-License-Identifier: GPL-2.0 */
/* The vendor kernel's Arm Streamline hooks; no-ops on mainline. */
#ifndef __STREAMLINE_ANNOTATE_H__
#define __STREAMLINE_ANNOTATE_H__

#define ANNOTATE_GREEN 0
#define ANNOTATE_NAME_CHANNEL(channel, group, str) do { } while (0)
#define ANNOTATE_CHANNEL_COLOR(channel, color, str) do { } while (0)
#define ANNOTATE_CHANNEL_END(channel) do { } while (0)

#endif
