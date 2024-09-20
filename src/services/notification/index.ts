// import {
// 	isPermissionGranted,
// 	requestPermission,
// 	sendNotification as sendAppNotification
// } from "@tauri-apps/plugin-notification"
// import type { Options } from "@tauri-apps/plugin-notification"

// export const isNotificationPermissionGranted = isPermissionGranted

// export async function sendNotification(options: Options | string) {
// 	const permissionGranted = await isNotificationPermissionGranted()
// 	if (!permissionGranted) {
// 		const isPermissionGranted = (await requestPermission()) === "granted"
// 		if (!isPermissionGranted) {
// 			showDialog({
// 				title: "权限",
// 				message: "未开启通知权限, 请在设置中打开通知权限"
// 			}).then(() => {})
// 			return
// 		}
// 	}
// 	sendAppNotification(options)
// }
