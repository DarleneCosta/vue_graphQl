import Vue from 'vue';
import Router from 'vue-router';
import DomainsList from '../components/DomainsList.vue';
import DomainView from '../components/DomainView.vue';

Vue.use(Router);

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/domains',
			name: 'DomainsList',
			component: DomainsList
		},
		{
			path: '/domain/:domain',
			component: DomainView, 
			props: true
		},
		{
			path:'/', 
			redirect:'/domains'
		}
	]
});