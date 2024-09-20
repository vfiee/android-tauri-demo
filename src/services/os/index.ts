// export * from "@tauri-apps/plugin-os"

const { TAURI_ENV_PLATFORM } = import.meta.env

export function isTauri() {
	return !!TAURI_ENV_PLATFORM
}
