import { EnvConfig, envConfigs, EnvType } from "@/config"
import { getStorage, removeStorage, setStorage, useAxios } from "@/services"
import { isTauri } from "@tauri-apps/api/core"
import { debounce, find, findIndex, get, includes, merge } from "lodash-es"
import { defineStore } from "pinia"
import type { NavBarProps } from "vant"
import { watch } from "vue"

interface showNavBarConfig {
	// 用户路由是否启用navbar
	enableNavbar: boolean
	// 是否只在tauri运行时显示navbar[权重更高,默认]
	isTauriShow: boolean
}

const { PROD } = import.meta.env

const APP_ENV = PROD ? "production" : "development"
const UPPERCASE_APP_ENV = APP_ENV.toUpperCase()
const STORE_USERINFO_KEY = `${UPPERCASE_APP_ENV}_STORAGE_USER_INFO`
const STORE_NAVBAR_CONFIG_KEY = `${UPPERCASE_APP_ENV}_NAVBAR_CONFIG`
const STORE_USER_SETTING_KEY = `${UPPERCASE_APP_ENV}_USER_SETTING`
const CURRENT_ENV = `${UPPERCASE_APP_ENV}_CURRENT_REQUEST_ENV`

const getEnvs = (): EnvConfig[] => {
	// 从本地存储中获取
	const storageEnv = getStorage<EnvConfig>(CURRENT_ENV)!
	const index = findIndex(envConfigs, { env: storageEnv?.env || APP_ENV })
	if (index !== -1) {
		envConfigs[index] = merge(storageEnv || envConfigs[index], { active: true })
	}
	return envConfigs as EnvConfig[]
}

const appStore = defineStore("app", {
	state: () => {
		const userInfo = getStorage(STORE_USERINFO_KEY)
		const showNavBarConfig = getStorage(STORE_NAVBAR_CONFIG_KEY)
		return {
			userInfo,
			envVisible: false,
			env: {
				visible: false,
				list: getEnvs()
			},
			isTauri: isTauri(),
			setting: {
				autoLogin: true
			},
			showNavBarConfig: showNavBarConfig || {
				enableNavbar: false,
				isTauriShow: true
			},
			navbarConfig: {
				fixed: true,
				placeholder: true,
				zIndex: 1000,
				safeAreaInsetTop: true
			} as NavBarProps
		}
	},
	actions: {
		setNavbarConfig(config: NavBarProps) {
			this.navbarConfig = config
		},
		setUserInfo(userInfo?: Record<string, any>): void {
			this.userInfo = userInfo
			if (userInfo) {
				setStorage(STORE_USERINFO_KEY, userInfo)
			} else {
				removeStorage(STORE_USERINFO_KEY)
			}
		},
		hasRole(roles: string | string[]) {
			if (typeof roles === "string") {
				return this.userInfo.roles.includes(roles)
			}
			return roles.some(role => this.userInfo.roles.includes(role))
		},
		removeUserInfo() {
			this.setUserInfo()
		},
		updateUserInfo(userInfo: Record<string, any>) {
			this.userInfo = merge(this.userInfo, userInfo)
		},
		updateEnvVisible(visible: boolean) {
			this.env.visible = visible
		},
		setEnv(envType: EnvType) {
			const index = findIndex(this.env.list, { env: envType })
			const currentActiveIndex = findIndex(this.env.list, { active: true })
			if (index === -1) return
			this.env.list[currentActiveIndex].active = false
			this.env.list[index].active = true
		},
		updateShowNavBarConfig(config: Partial<showNavBarConfig>) {
			this.showNavBarConfig = merge({}, this.showNavBarConfig, config)
		},
		async updateUser(userinfo: Record<string, any>) {
			const { data, error } = await useAxios(
				{
					method: "post",
					url: `/user/update`,
					data: userinfo
				},
				{ immediate: true }
			)
			if (error.value) return
			this.updateUserInfo(data.value)
		},
		async getLatestUserInfo() {
			const { data, error } = await useAxios(
				{
					url: `/user/detail`
				},
				{ immediate: true }
			)
			if (error.value) return
			this.updateUserInfo(data.value)
		}
	},
	getters: {
		isTeamOwner: state =>
			get(state, "userInfo.userId") === get(state, "userInfo.team.ownerId"),
		isAdmin: state => includes(get(state, "userInfo.roles"), "admin"),
		accessToken: state => get(state, "userInfo.access_token"),
		currentEnv: (state): EnvConfig => find(state.env.list, { active: true })!,
		isLogin(this: Record<string, any>): boolean {
			return !!this.accessToken
		},
		userHeader(this: Record<string, any>): string {
			return this.isLogin ? `Bearer ${this.accessToken}` : ""
		},
		showNavBar(this: Record<string, any>): boolean {
			const { enableNavbar, isTauriShow } = this.showNavBarConfig || {}
			return isTauriShow ? !!(this.isTauri && enableNavbar) : !!enableNavbar
		}
	}
})

export function useAppStore() {
	const store = appStore()
	watch(
		store.$state,
		debounce(state => {
			const { setting, showNavBarConfig, userInfo } = state || {}
			setStorage(STORE_NAVBAR_CONFIG_KEY, showNavBarConfig)
			setStorage(STORE_USERINFO_KEY, userInfo)
			setStorage(STORE_USER_SETTING_KEY, setting)
			setStorage(CURRENT_ENV, find(state.env.list, { active: true }))
		}, 500)
	)
	return store
}
