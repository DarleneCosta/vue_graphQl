import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios/dist/axios';
import App from './App';
import router from './router';

Vue.use(Vuex);
const store = new Vuex.Store({
	state: {	
		items: {		
			prefix: [],
			sufix: []
		},
		domains: []
	},
	mutations: {
		addItem(state, payload) {
			const { item, newItem } = payload;
			state.items[item.type].push(newItem);
		},
		deleteItem(state, payload) {
			const { item } = payload;
			state.items[item.type].splice(state.items[item.type].indexOf(item),1);
		},
		setItems(state, payload) {
			const { items, type } = payload;
			state.items[type] = items;
		}, 
		setDomains(state, payload) {
			const { domains } = payload;
			state.domains = domains;
		}
	},
	actions: {
		async addItem (context, payload) {
			const item = payload;
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
				context.commit('addItem', { item, newItem });
				context.dispatch('generateDomains');/*invocar a action*/
			});
		}, 
		async deleteItem (context, payload) {
			const item = payload;			
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
				if (retorno.data.deleted){
					context.commit('deleteItem', { item });
					context.dispatch('generateDomains');
				}
			});
		},
		async getItems (context, payload){
			const type = payload;
			return axios ({
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
				context.commit('setItems', { items: query.data.items, type });
			});
		},
		async generateDomains (context) {
			axios ({
				url: 'http://localhost:4000',
				method: "post",
				data: {
					query:`
					mutation {
						domains: generateDomains {
							name, 
							checkout, 
							available
						}
					}
					`
				}
			}).then(response =>{
				const query = response.data;
				context.commit('setDomains', { domains: query.data.domains });
			});
		}
	}
});

Promise.all([
	store.dispatch('getItems','prefix'),
	store.dispatch('getItems','sufix')
]).then(() => {
	store.dispatch('generateDomains');
});

Vue.config.productionTip = false;

new Vue({
	store,
	router,	
	render: h => h(App)
}).$mount('#app');