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
              <div class="col-md">
                {{ domain.name }}
              </div>
              <div class="col-md text-right">
                <a class="btn btn-info" v-bind:href="domain.checkout" target="_blank">
                  <span class="fa fa-shopping-cart"></span>
                </a>
              </div>
            </div>
          </li>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
import axios from 'axios/dist/axios';
import AppItemList from "./AppItemList";
export default {
	name: 'DomainsList',
	components: {
		'app-item-list': AppItemList
	},
	data: function () {
		return {
			items: {		
				prefix: [],
				sufix: []
			}
		};
	}, 
	methods:{
		addItem(item) {
			axios ({
				url: 'http://localhost:4000',
				method: "post",
				data: {
					query:`
							mutation ($item: ItemInput) {
								newItem: saveItem(item: $item) {
									id
									type
									description
								}
							}
						`,
					variables: {
						item
					}
				}
			}).then(response => {
				const query = response.data;
				const newItem = query.data.newItem;			
				this.items[item.type].push(newItem);
			});
		}, 
		deleteItem(item){			
			axios ({
				url: 'http://localhost:4000',
				method: "post",
				data: {
					query:`
							mutation ($id:Int){
								deleted: deleteItem (id: $id)								
							}
						`,
					variables: {							
						id: item.id
					}
				}
			}).then(response=> {
				const retorno = response.data;				
				if (retorno.data.deleted)
					this.getItems(item.type);
			});
		},
		getItems(type){
			axios ({
				url: 'http://localhost:4000',
				method: "post",
				data: {
					query:`
					query ($type: String)
					{
						items: items (type: $type) {
								id
								type
								description
						}
					}`,
					variables: {
						type
					}
				}
			}).then(response =>{
				const query = response.data;
				this.items[type] = query.data.items;
			});
		}		
	}, 
	computed:{
		domains() {
			const domains = [];
			for (const prefix of this.items.prefix) {
				for (const sufix of this.items.sufix) {
					const name = prefix.description + sufix.description;
					const url = name.toLowerCase();
					const checkout=`https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=.com.br`;
					domains.push({name, checkout});
				}
			}
			return domains;
		}
	},
	created() {
		this.getItems('prefix');
		this.getItems('sufix');
	}
};
</script>

