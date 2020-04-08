<template>  
  <div class="container">
    <div class="row">
      <div class="col-md">
        <app-item-list title="Prefixos" type="prefix" v-bind:items="items.prefix" v-on:addItem="addItem" v-on:deleteItem="deleteItem"/>            
      </div>
      <div class="col-md">
        <app-item-list title="Sufixos" type="sufix" v-bind:items="items.sufix" v-on:addItem="addItem" v-on:deleteItem="deleteItem"/>            
      </div>
    </div>
    <br/>
    <h5>Dominios <span class="badge badge-info">{{domains.length}}</span></h5>
    <div class="card">
      <div class="card-body">
        <div class="list-group">
          <li class="list-group-item" v-for="domain in domains" v-bind:key="domain.name">
            <div class="row">
              <div class="col-md-6">
                {{ domain.name }}								
              </div>
							<div class="col-md-3">
								<span class="badge badge-info">{{(domain.available)?"Disponível":"Não disponível"}}</span>								
							</div>
              <div class="col-md-3 text-right">
                <a class="btn btn-info" v-bind:href="domain.checkout" target="_blank">
                  <span class="fa fa-shopping-cart"></span>
                </a>
								&nbsp;
								<button class="btn btn-info" @click="openDomain(domain)">
									<span class="fa fa-search"></span>
								</button>
              </div>
            </div>
          </li>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
import { mapState, mapActions } from 'vuex';
import AppItemList from "./AppItemList";
export default {
	name: 'DomainsList',
	components: {
		'app-item-list': AppItemList
	},
	data () {
		return {};
	}, 
	methods:{
		...mapActions(['addItem','deleteItem','getItems','generateDomains']),
		openDomain(domain) {
			this.$router.push({
				path:`/domain/${domain.name}`
			});
		}
	},
	computed: {/*mapeamento do state*/
		...mapState(['domains','items'])
	}
};
</script>

