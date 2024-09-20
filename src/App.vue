<script lang="ts" setup>
import { instance, useAxios } from '@/services';
import { axios } from '@/services/request';
import { fetch } from '@tauri-apps/plugin-http';
import { reactive } from 'vue';

const formModel = reactive({
  username: 'qingxin',
  password: '123456'
})

const { isLoading, error, execute } = useAxios({
  method: 'POST',
  url: `https://sun-platform.vfiee.cn/user/login`
})

async function onSubmit() {
  await execute({ data: formModel }).catch(console.error)
  if (error.value) return
  showSuccessToast('登录成功')
}

const getJson = async () => {
  const response = await instance(`https://sun-platform.vfiee.cn/user/login`, {
    method: 'POST',
    data: formModel,
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch((err) => {
    showDialog({ message: `error:` + JSON.stringify(err) })
  })

  showDialog({ message: `success:` + JSON.stringify(response) })
}

const getJson2 = async () => {
  const response = await fetch(`https://sun-platform.vfiee.cn/user/login`, {
    method: 'POST',
    body: JSON.stringify(formModel),
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch((err) => {
    showDialog({ message: `error:` + JSON.stringify(err) })
  })
  const data = await response?.json()
  showDialog({ message: `success:` + JSON.stringify(data) })
}
const getJson3 = async () => {
  const data = await axios(`/user/login`, {
    method: 'POST',
    data: formModel,
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch((err) => {
    showDialog({ message: `error:` + JSON.stringify(err) })
  })
  showDialog({ message: `success:` + JSON.stringify(data) })
}
</script>
<template>
  <div
    class="flex flex-col items-center w-full h-full overflow-hidden pt-36 bg-white"
  >
    <van-form class="pt-20 w-full" colon label-width="3em" @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="formModel.username"
          name="username"
          label="账号"
          placeholder="请输入用户名或邮箱"
          :rules="[{ required: true, message: '请输入用户名或邮箱' }]"
        />
        <van-field
          v-model="formModel.password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div class="mt-16 mr-10 ml-10">
        <van-button
          class="van-haptics-feedback"
          round
          block
          type="primary"
          native-type="submit"
          :loading="isLoading"
        >
          提交
        </van-button>
        <van-button
          class="van-haptics-feedback mt-10"
          round
          block
          type="primary"
          @click="getJson"
        >
          instance
        </van-button>
        <van-button
          class="van-haptics-feedback mt-10"
          round
          block
          type="primary"
          @click="getJson2"
        >
          fetch
        </van-button>
        <van-button
          class="van-haptics-feedback mt-10"
          round
          block
          type="primary"
          @click="getJson3"
        >
          axios
        </van-button>
      </div>
    </van-form>
  </div>
</template>
