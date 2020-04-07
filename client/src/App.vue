<template>
  <div id="app">
    <div id="slogan" class="text-center">
      <h1>NameGator</h1>
      <br/>
      <h6 class="text-secondary">Gerador de nomes utilizando Vue.js, GraphQl e Node</h6>
    </div>
    <div id="main">   
      <domains-list />
    </div>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import DomainsList from "./components/DomainsList";
export default {
	name: 'App',
	components: {
		'domains-list': DomainsList
	}
};
</script>

<style>
  #slogan {
    margin-top: 30px;
    margin-bottom:30px;
  }
  #main{
    background-color:#F1F1F1;
    padding-top: 30px;
    padding-bottom:30px;
  }
</style>
