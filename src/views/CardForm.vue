<script setup>
import {computed, onBeforeUnmount, onMounted, reactive, ref} from "vue";
import {useVuelidate} from '@vuelidate/core'
import {maxLength, minLength, required} from '@vuelidate/validators'


const formData = reactive({
  name: "",
  cardNumber: "",
  cvc: "",
  years: [],
  options: [
    {name: 1, value: 1},
    {name: 2, value: 2},
    {name: 3, value: 3},
    {name: 4, value: 4},
    {name: 5, value: 5},
    {name: 6, value: 6},
    {name: 7, value: 7},
    {name: 8, value: 8},
    {name: 9, value: 9},
    {name: 10, value: 10},
    {name: 11, value: 11},
    {name: 12, value: 12},
  ],
  selectedMonth: 1,
  selectedYear: String(new Date().getFullYear()).slice(-2),
  isOpened: false,
  isMonthOpened: false,
})

const rules = computed(() => {
  return {
    name: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(25)
    },
    cardNumber: {
      required,
      minLength: minLength(16),
      maxLength: maxLength(19)
    },
    cvc: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(3)
    }
  }
})

const success = ref(false)

const v$ = useVuelidate(rules, formData)

let passwordFieldType = ref("password")

const switchVisibility = () => {
  if (formData.cvc.length > 0) {
    passwordFieldType.value = passwordFieldType.value === "password" ? "text" : "password";
  }
}

const submitForm = async () => {
  const result = await v$.value.$validate()
  if (result) {
    success.value = true
  }
}


const optionsSelect = (option) => {
  formData.selectedMonth = option.name
  formData.isMonthOpened = false
}
const yearSelect = (year) => {
  formData.selectedYear = year
  formData.isOpened = false
}
const getYear = () => {
  let currentYear = String(new Date().getFullYear()).slice(-2)
  for (let i = Number(currentYear); i <= Number(currentYear) + 5; i++) {
    formData.years.push(i)
  }
}
const hideSelect = () => formData.isOpened = false


onMounted(() => {
  getYear()
  document.addEventListener("click", hideSelect, true)
})
onBeforeUnmount(() => {
  document.removeEventListener("click", hideSelect, true)
})
</script>

<template>
  <main>
    <div class="mx-auto w-full max-w-[550px] p-8">

      <div class="flex">

      </div>

      <form @submit.prevent="submitForm">
        <div class="mb-5">
          <label
              for="name"
              class="mb-3 block text-base font-medium text-[#07074D]"
          >
            Full Name
          </label>
          <input
              v-model="formData.name"
              type="text"
              name="name"
              placeholder="Full Name"
              class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 my-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
          />
          <span
              class=" text-red-600 dark:text-red-500"
              v-for="error in v$.name.$errors"
              :key="error.$uid">{{ error.$message }}</span>
        </div>
        <div class="mb-5">
          <label
              for="Card Number"
              class="mb-3 block text-base font-medium text-[#07074D]"
          >
            Card Number
          </label>
          <input
              v-maska="'#### #### #### ####'"
              v-model="formData.cardNumber"
              type="text"
              name="Card Number"
              placeholder="e.g 1234 5678 9009 8765"
              class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 my-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
          />
          <span
              class=" text-red-600 dark:text-red-500"
              v-for="error in v$.cardNumber.$errors"
              :key="error.$uid">{{ error.$message }}</span>

        </div>
        <div class="flex justify-between rounded-md gap-8">
          <div class="w-1/2">
            <div @click="formData.isMonthOpened = !formData.isMonthOpened"
                 class="rounded-md border border-[#e0e0e0] py-3 px-6">{{
                formData.selectedMonth
              }}
            </div>
            <div class="rounded-md py-3 border border-[#e0e0e0]" v-if="formData.isMonthOpened">
              <div @click="optionsSelect(option)" v-if="formData.isMonthOpened"
                   class="cursor-pointer py-2 px-6 hover:bg-slate-200"
                   v-for="option in formData.options"
                   :key="option.value">
                {{ option.name }}
              </div>
            </div>
          </div>
          <div class="w-1/2">
            <div @click="formData.isOpened = !formData.isOpened" class="rounded-md border border-[#e0e0e0] py-3 px-6">
              {{ formData.selectedYear }}
            </div>
            <div class="rounded-md py-3 border border-[#e0e0e0]" v-if="formData.isOpened">
              <div @click="yearSelect(year)" v-if="formData.isOpened" v-for="year in formData.years"
                   class="cursor-pointer py-2 px-6 hover:bg-slate-200">
                {{ year }}
              </div>
            </div>
          </div>
        </div>
        <div class="mt-5">
          <label
              for="CVC"
              class="mb-3 block text-base font-medium text-[#07074D]"
          >
            Card Number
          </label>
          <div class="flex justify-between items-center rounded-md border border-[#e0e0e0] px-6">
            <input
                v-maska="'###'"
                v-model="formData.cvc"
                :type="passwordFieldType"
                type="text"
                name="CVC"
                placeholder="e.g 123"
                class="w-full bg-white py-3 my-4 text-base font-medium text-[#6B7280] outline-none"
            />
            <div class="cursor-pointer" @click="switchVisibility">
              <svg v-if="passwordFieldType == 'password'" xmlns="http://www.w3.org/2000/svg" height="48" width="48">
                <path
                    d="M24 31.5q3.55 0 6.025-2.475Q32.5 26.55 32.5 23q0-3.55-2.475-6.025Q27.55 14.5 24 14.5q-3.55 0-6.025 2.475Q15.5 19.45 15.5 23q0 3.55 2.475 6.025Q20.45 31.5 24 31.5Zm0-2.9q-2.35 0-3.975-1.625T18.4 23q0-2.35 1.625-3.975T24 17.4q2.35 0 3.975 1.625T29.6 23q0 2.35-1.625 3.975T24 28.6Zm0 9.4q-7.3 0-13.2-4.15Q4.9 29.7 2 23q2.9-6.7 8.8-10.85Q16.7 8 24 8q7.3 0 13.2 4.15Q43.1 16.3 46 23q-2.9 6.7-8.8 10.85Q31.3 38 24 38Zm0-15Zm0 12q6.05 0 11.125-3.275T42.85 23q-2.65-5.45-7.725-8.725Q30.05 11 24 11t-11.125 3.275Q7.8 17.55 5.1 23q2.7 5.45 7.775 8.725Q17.95 35 24 35Z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path fill="#939393" d="m31.45 27.05-2.2-2.2q1.3-3.55-1.35-5.9-2.65-2.35-5.75-1.2l-2.2-2.2q.85-.55 1.9-.8 1.05-.25 2.15-.25 3.55 0 6.025 2.475Q32.5 19.45 32.5 23q0 1.1-.275 2.175-.275 1.075-.775 1.875Zm6.45 6.45-2-2q2.45-1.8 4.275-4.025Q42 25.25 42.85 23q-2.5-5.55-7.5-8.775Q30.35 11 24.5 11q-2.1 0-4.3.4-2.2.4-3.45.95L14.45 10q1.75-.8 4.475-1.4Q21.65 8 24.25 8q7.15 0 13.075 4.075Q43.25 16.15 46 23q-1.3 3.2-3.35 5.85-2.05 2.65-4.75 4.65Zm2.9 11.3-8.4-8.25q-1.75.7-3.95 1.075T24 38q-7.3 0-13.25-4.075T2 23q1-2.6 2.775-5.075T9.1 13.2L2.8 6.9l2.1-2.15L42.75 42.6ZM11.15 15.3q-1.85 1.35-3.575 3.55Q5.85 21.05 5.1 23q2.55 5.55 7.675 8.775Q17.9 35 24.4 35q1.65 0 3.25-.2t2.4-.6l-3.2-3.2q-.55.25-1.35.375T24 31.5q-3.5 0-6-2.45T15.5 23q0-.75.125-1.5T16 20.15Zm15.25 7.1Zm-5.8 2.9Z"/></svg>
            </div>
          </div>
          <span
              class=" text-red-600 dark:text-red-500"
              v-for="error in v$.cvc.$errors"
              :key="error.$uid">{{ error.$message }}</span>
        </div>
        <button
            class="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 mt-4 text-base font-semibold text-white outline-none"
        >
          Submit
        </button>
      </form>
      <div v-if="success"
           class="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
        <div class="bg-white px-16 py-14 rounded-md text-center">
          <h1 class="text-xl mb-4 font-bold text-slate-500">Card has been successfully added </h1>
          <button @click="success = false"
                  class="bg-indigo-500 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold">Ok
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
