/**
 * link: https://github.com/type-challenges/type-challenges/blob/main/questions/00006-hard-simple-vue/README.zh-CN.md
 * 题目：通过提供一个函数SimpleVue（类似于 Vue.extend 或 defineComponent ），它应该正确地推断出 computed 和 methods 内部的this类型。
 *
 * 在此挑战中，我们假设 SimpleVue 接受只带有 data，computed 和 methods 字段的 Object 作为其唯一的参数，
 *
 * - data 是一个简单的函数，它返回一个提供上下文this的对象，但是你无法在data中获取其他的计算属性或方法。
 * - computed 是将 this 作为上下文的函数的对象，进行一些计算并返回结果。在上下文中应暴露计算出的值而不是函数。
 * - methods 是函数的对象，其上下文也 为 this。函数中可以访问 data，computed 以及其他methods中的暴露的字段。 computed与methods的不同之处在于methods在上下文中按原样暴露为函数。
 *
 * SimpleVue的返回值类型可以是任意的。
 */

const instance = {
  data() {
    return {
      firstname: 'Type',
      lastname: 'Challenges',
      amount: 10,
    }
  },
  computed: {
    fullname() {
      return this.firstname + ' ' + this.lastname
    }
  },
  methods: {
    hi() {
      alert(this.fullname.toLowerCase())
    }
  }
}

