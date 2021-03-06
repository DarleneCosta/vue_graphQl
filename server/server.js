const { ApolloServer } = require('apollo-server');
const dns = require('dns');

const typeDefs = `
	type Item {
		id: Int 
		type: String
		description: String
	}
	
	type Domain {
		name: String
		extension: String
		checkout: String 
		available: Boolean
	}

	type Query {
		items (type: String):[Item]
	}
	
	input ItemInput {
		type: String
		description: String
	}

	type Mutation {
		saveItem (item: ItemInput): Item
		deleteItem (id: Int): Boolean
		generateDomain (name:String): [Domain]
		generateDomains: [Domain]		
	}

`;

const items = [
	{ id: 1, type: 'prefix', description:'Air'},
	{ id: 2, type: 'prefix', description:'Jet'},
	{ id: 3, type: 'prefix', description:'Flight'},
	{ id: 4, type: 'sufix', description:'Hub'},
	{ id: 5, type: 'sufix', description:'Station'},
	{ id: 6, type: 'sufix', description:'Mart'},
];

const isDomainAvailable = function (url) {
	return new Promise (function (resolve, reject ){
		dns.resolve(url, function (error) {
			if(error) {
				resolve(true);
			}
			else { 
				resolve(false);
			}
		});
	});
};

const resolvers = {
	Query: {
		items(_, args ) {
			console.log('getItems', args.type);
			return items.filter(item => item.type === args.type);
		}
	}, 
	Mutation: {		
		deleteItem(_, args) {
			const id = args.id;
			console.log(args)
			const item = items.find(item => item.id === id);			
			if(!item) return false;			
			items.splice(items.indexOf(item),1)
			return true;
		},
		async generateDomain(_, args){
			const domains = [];
			const name = args.name;
			const extensions = ['.com.br', '.com', '.net', '.org'];			
			for (const extension of extensions) {				
				const url = name.toLowerCase();
				const checkout=`https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=${extension}`;
				const available = await isDomainAvailable(`${url}${extension}`);
				domains.push({name, extension, checkout, available});								
			}			
			return domains;
		},
		async generateDomains() {
			console.log('generateDomains');
			const domains = [];
			const extension = '.com.br';		
			for (const prefix of items.filter(item => item.type === 'prefix')) {
				for (const sufix of items.filter(item => item.type === 'sufix')) {
					const name = prefix.description + sufix.description;
					const url = name.toLowerCase();
					const checkout=`https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=${extension}`;;
					const available = await isDomainAvailable(`${url}${extension}`);
					domains.push({name, extension, checkout, available});
				}
			}
			return domains;
		},
		saveItem(_, args) {		
			const item = args.item;
			item.id = Math.floor(Math.random()*1000);
			items.push(item);			
			return item;
		}
	}
}
const server = new ApolloServer({ typeDefs, resolvers });
server.listen();