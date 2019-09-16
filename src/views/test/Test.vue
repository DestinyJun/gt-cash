<template>
  <div>
    <h1>表单校验</h1>
    <div>
      <div class="form-group" :class="{ 'form-group--error': $v.form.userName.$error }">
        <label class="form__label">用户名</label>
        <input class="form__input" v-model.trim="$v.form.userName.$model"/>
      </div>
      <!--<div class="error" v-if="!$v.form.userName.required">用户名 is required.</div>-->
      <!--<div class="error" v-if="!$v.form.userName.minLength">
        Field must have at least {{$v.form.userName.$params.minLength.min }} characters.
      </div>-->
      <div class="form-group" :class="{ 'form-group--error': $v.form.password.$error }">
        <label class="form__label">Password</label>
        <input class="form__input" v-model.trim="$v.form.password.$model" type="password"/>
      </div>
      <!--<div class="error" v-if="!$v.form.password.required">Field is required.</div>-->
     <!-- <div class="error" v-if="!$v.form.password.minLength">
        Field must have at least {{$v.form.password.$params.minLength.min }} characters.
      </div>-->
      <div class="form-group" :class="{ 'form-group--error': $v.form.$error }">
        <div class="error" v-if="$v.form.$error">Form is invalid.</div>
      </div>
    </div>
  </div>
</template>
<script src="./Test.component.js"></script>
<style scoped>
  .form-group--error .form__label, .form-group--error .form__label--inline {
    color: #f04124;
  }

  .form-group--error input, .form-group--error textarea, .form-group--error input:focus, .form-group--error input:hover {
    border-color: #f79483;
  }
</style>
