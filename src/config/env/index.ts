export type EnvType = "development" | "test" | "production" | "mock"

export declare interface EnvModule {
	url: string
	proxyPrefix: string
}

export interface EnvConfig {
	// 请求环境,与 process.env.APP_ENV 对应
	env: EnvType
	// 环境名称
	name: string
	// 是否默认(选择的)环境
	active?: boolean
	// 模块
	modules: {
		common: EnvModule
		[key: string]: EnvModule
	}
	[key: string]: any
}

export const envConfigs: Omit<EnvConfig, "active">[] = [
	{
		env: "development",
		name: "dev环境",
		modules: {
			common: {
				proxyPrefix: "dev",
				url: "http://localhost:3000"
			}
		}
	},
	{
		env: "test",
		name: "test环境",
		modules: {
			common: {
				proxyPrefix: "test",
				url: "https://release-sun-platform.vfiee.cn"
			}
		}
	},
	{
		env: "production",
		name: "prod环境",
		modules: {
			common: {
				proxyPrefix: "prod",
				url: "https://sun-platform.vfiee.cn"
			}
		}
	}
]
