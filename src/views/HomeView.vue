<script setup>
import {computed, onBeforeUnmount, onMounted, reactive, ref} from "vue";
import {useVuelidate} from '@vuelidate/core'
import {maxLength, minLength, required} from '@vuelidate/validators'
import router from "@/router";

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

const v$ = useVuelidate(rules, formData)

let passwordFieldType = ref("password")

// const switchVisibility = () => {
//   if (formData.cvc.length > 0) {
//     passwordFieldType.value = passwordFieldType.value === "password" ? "text" : "password";
//     // formData.visibilityImg = formData.visibilityImg === require("../assets/visibility-on.svg") ? require("../assets/visibility-off.svg") : require("../assets/visibility-on.svg")
//   }

  const submitForm = async () => {
    const result = await v$.value.$validate()
    if (result) {
      router.push("/about")
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
            <div @click="formData.isMonthOpened = !formData.isMonthOpened" class="rounded-md border border-[#e0e0e0] py-3 px-6">{{
                formData.selectedMonth
              }}
            </div>
            <div class="rounded-md py-3 border border-[#e0e0e0]" v-if="formData.isMonthOpened">
              <div @click="optionsSelect(option)" v-if="formData.isMonthOpened" class="cursor-pointer py-2 px-6 hover:bg-slate-200"
                   v-for="option in formData.options"
                   :key="option.value">
                {{ option.name }}
              </div>
            </div>
          </div>
          <div class="w-1/2">
            <div @click="formData.isOpened = !formData.isOpened" class="rounded-md border border-[#e0e0e0] py-3 px-6">{{ formData.selectedYear }}</div>
            <div class="rounded-md py-3 border border-[#e0e0e0]" v-if="formData.isOpened">
              <div @click="yearSelect(year)" v-if="formData.isOpened" v-for="year in formData.years"  class="cursor-pointer py-2 px-6 hover:bg-slate-200">
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
          <input
              v-maska="'###'"
              v-model="formData.cvc"
              :type="passwordFieldType"
              type="text"
              name="CVC"
              placeholder="e.g 123"
              class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 my-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
          />
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
    </div>
  </main>
</template>
