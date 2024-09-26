<script lang="ts" setup>
import { instance, useAxios } from '@/services';
import { axios } from '@/services/request';
import { fetch } from '@tauri-apps/plugin-http';
import { showConfirmDialog } from 'vant';

const data = { apiFox: true, isMock: true }
const params = { isParams: true, q: 2 }
const url = `https://echo.apifox.com/post`
const method = 'GET'

const {
  data: response,
  error,
  execute
} = useAxios({
  method,
  url
})

async function onSubmit() {
  await execute({ data, params }).catch(console.error)
  if (error.value) {
    await showConfirmDialog({ message: JSON.stringify(error.value) })
    return
  }
  await showConfirmDialog({ message: JSON.stringify(response.value) })
}

const getJson = async () => {
  const response = await instance(url, {
    method,
    data,
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch(async (err) => {
    await showConfirmDialog({ message: JSON.stringify(err) })
  })

  await showConfirmDialog({ message: JSON.stringify(response) })
}

const getJson2 = async () => {
  const res = await fetch(url, {
    method,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch(async (err) => {
    await showConfirmDialog({ message: JSON.stringify(err) })
  })
  await showConfirmDialog({ message: JSON.stringify(await res?.json()) })
}

const getJson4 = async () => {
  const res = await window
    .fetch(url, {
      method,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .catch(async (err) => {
      await showConfirmDialog({ message: JSON.stringify(err) })
    })
  await showConfirmDialog({ message: JSON.stringify(await res?.json()) })
}
const getJson3 = async () => {
  const response = await axios(url, {
    method,
    data,
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  }).catch(async (err) => {
    await showConfirmDialog({ message: JSON.stringify(err) })
  })
  await showConfirmDialog({ message: JSON.stringify(response) })
}
</script>
<template>
  <div
    class="flex flex-col items-center w-full h-full overflow-hidden pt-36 bg-white"
  >
    <div class="mt-16 mr-10 ml-10">
      <van-button
        class="van-haptics-feedback"
        round
        block
        type="primary"
        @click="onSubmit"
      >
        @vueUse/useAxios
      </van-button>
      <van-button
        class="van-haptics-feedback mt-10"
        round
        block
        type="primary"
        @click="getJson"
      >
        axios instance
      </van-button>
      <van-button
        class="van-haptics-feedback mt-10"
        round
        block
        type="primary"
        @click="getJson4"
      >
        window.fetch
      </van-button>
      <van-button
        class="van-haptics-feedback mt-10"
        round
        block
        type="primary"
        @click="getJson2"
      >
        tauri-plugin-http.fetch
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
  </div>
</template>
