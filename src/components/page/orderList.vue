<template>
    <div>
        <table class='table'>
            <thead>
                <tr class='font-weight-bold'>
                    <td>購買時間</td>
                    <td>Email</td>
                    <td>購買款項</td>
                    <td>應付金額</td>
                    <td>是否付款</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for='item in orders' :key='item.id'>
                    <td>{{createDate(item.create_at)}}</td>
                    <td>{{item.user.email}}</td>
                    <td>
                        <span v-for='(val,nam) in item.products'>{{val.product.title +' '}}</span>
                    </td>
                    <td>{{item.total}}</td>
                    <td v-if='(item.is_paid)' class='text-success'>付款完成</td>
                    <td v-else class='text-danger'>未付款</td>
                </tr>
            </tbody>
        </table>

    </div>

</template>

<script>
    export default {
        data(){
            return{
                orders:[],
                products:[],
                user:{},
                product:[],

            }
        },
        computed:{
            
        },
        methods: {
            createDate(d){
                let create = new Date(d*1000);
                const year = create.getFullYear();
                const month = ('0' + (create.getMonth()+1)).slice(-2);
                const date = ('0' + create.getDate()).slice(-2);
                return year + '/' + month + '/' + date

            },
            getOrderList(page=1){
                let vm = this;
                vm.$http.get(`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/orders?page=${page}`).then((response)=>{
                    if(response.data.success){
                        console.log(response.data);
                        vm.orders = response.data.orders;
                        vm.getProductsInOrder();
                    }
                })
            },
            getProductsInOrder(){
                let vm = this;
                for(let i=0;i<vm.orders.length;i++){
                    vm.products.push(vm.orders[i].products);
                }
                for(let i=0;i<vm.products.length;i++){
                    vm.product.push(Object.values(vm.products[i]).map(item => item.product));
                };
               
                // console.log(vm.product);

            }
        },
        created() {
            this.getOrderList();
        },

    }

</script>

