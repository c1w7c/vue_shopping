<template>
    <div>
        <div class='row mt-4'>
            <loading :active.sync="isLoading"></loading>
            <div class="col-md-4 mb-4" v-for='item in products' :key="item.id">
                <div class="card border-0 shadow-sm">
                    <div :style="{height: 150+'px', backgroundSize: 'cover', backgroundPosition: 'center',backgroundImage:`url(${item.imageUrl})`}">
                    </div>
                    <div class="card-body">
                    <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
                    <h5 class="card-title">
                        <a href="#" class="text-dark">{{item.title}}</a>
                    </h5>
                    <p class="card-text">{{item.content}}</p>
                    <div class="d-flex justify-content-between align-items-baseline">
                        <!-- <div class="h5">2,800 元</div> -->
                        <del class="h6">{{item.origin_price}}</del>
                        <div class="h5">{{item.price}}</div>
                    </div>
                    </div>
                    <div class="card-footer d-flex">
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="getProduct(item.id)">
                        <i class="fas fa-spinner fa-spin" v-if="item.id === status.loadingItem"></i>
                        查看更多
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click = "addtoCart(item.id)">
                        <i class="fas fa-spinner fa-spin" v-if="item.id === status.loadingItem"></i>
                        加到購物車
                    </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-sm-8 mx-auto" v-if='(cartHasValue)'>
            <table class="table" >
                <thead>
                    <tr>
                        <td colspan='2' class='text-center'>品名</td>
                        <td>數量</td>
                        <td>單價</td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for='item in cart.carts' :key='item.id'>
                        <td>
                            <button class='btn btn-outline-danger btn-sm' @click='delCartItem(item)'><i class="fas fa-trash text-danger"></i></button>
                        </td>
                        <td>{{item.product.title}}
                            <div class='text-success' v-show="(couponSuccess && couponEnabled === 'enabled')">已套用優惠券</div>
                        </td>
                        <td class='text-right'>{{item.qty}}</td>
                        <td class='text-right'>{{item.final_total | currency}}</td>
                    </tr>
                    <tr>
                        <td colspan='4' class='text-right'>總計：{{cart.total | currency}}</td>
                    </tr>
                    <tr>
                        <td colspan='4' class="text-success text-right" v-if='(cart.total != cart.final_total && couponSuccess)'>折扣價：{{cart.final_total | currency}}</td>
                    </tr>
                </tbody>
            </table>
            <div class="input-group mb-3 position-relative">
                <input type="text" class="form-control" placeholder="請輸入優惠碼" aria-label="Recipient's username" aria-describedby="basic-addon2" v-model='coupon' :disabled='couponSuccess'>
                <a href='#' class='text-decoration-none' @click.prevent='setCoupon'><span class="input-group-text" id="basic-addon2" >優惠碼</span></a>
                <span class='text-danger position-absolute font-weight-bolder blink' style='top:-30px' v-if="(!couponSuccess && couponEnabled === 'enabled')">優惠碼不存在</span>
            </div>
        </div>
        <!-- 結帳 -->
        <validation-observer v-slot='{handleSubmit,invalid}' tag='div' class='my-5 row justify-content-center' v-if='cartHasValue'>
            <form class="col-md-6" @submit.prevent='handleSubmit(sendOrder)'>
                <validation-provider v-slot="{failed,errors,validated}" name='email' rules='required'>
                    <div class="form-group">
                        <label for="useremail" class='font-weight-bolder'>Email</label>
                        <input type="email" class="form-control" name="email" id="useremail" :class="{'is-invalid shake':failed ,'is-valid':!failed && validated}"
                            v-model="form.user.email" placeholder="請輸入 Email" required>
                        <span v-if='failed' class="invalid-feedback">{{errors[0]}}</span>
                    </div>
                </validation-provider>
                <validation-provider v-slot="{failed,errors,validated}" name='姓名' rules='required|nameRule'>
                    <div class="form-group">
                        <label for="username" class='font-weight-bolder'>收件人姓名</label>
                        <input type="text" class="form-control" name="name" id="username" :class="{'is-invalid shake':failed ,'is-valid':!failed && validated}"
                            v-model="form.user.name" placeholder="輸入姓名">
                        <span v-if='failed' class="invalid-feedback">{{errors[0]}}</span>
                    </div>
                </validation-provider>
                <validation-provider v-slot="{failed,errors,validated}" name='手機' rules='required|phoneRule'>
                    <div class="form-group">
                        <label for="usertel" class='font-weight-bolder'>收件人電話</label>
                        <input type="tel" class="form-control" id="usertel" v-model="form.user.tel" placeholder="請輸入電話" 
                        :class="{'is-invalid shake':failed ,'is-valid':!failed && validated}">
                        <span v-if='failed' class="invalid-feedback">{{errors[0]}}</span>
                    </div>
                </validation-provider>
                <validation-provider v-slot='{failed,errors,validated}' name='地址' rules='required'>
                    <div class="form-group">
                        <label for="useraddress" class='font-weight-bolder'>收件人地址</label>
                        <input type="text" class="form-control" name="address" id="useraddress" v-model="form.user.address"
                            :class="{'is-invalid shake':failed ,'is-valid':!failed && validated}" placeholder="請輸入地址">
                        <span  v-if='failed' class="invalid-feedback">{{errors[0]}}</span>
                    </div>
                </validation-provider>
                <validation-provider v-slot='{failed,errors,validated}' name='留言' rules='required'>
                    <div class="form-group">
                        <label for="comment" class='font-weight-bolder'>留言</label>
                        <textarea name="" id="comment" class="form-control" cols="30" rows="10" v-model="form.message" :class="{'is-invalid shake':failed ,'is-valid':!failed && validated}"></textarea>
                        <span  v-if='failed' class="invalid-feedback">{{errors[0]}}</span>
                    </div>
                </validation-provider>
                <div class="text-right">
                    <button type='submit'class="btn btn-primary" :disabled='invalid'>送出訂單</button>
                </div>
            </form>
        </validation-observer>
        <!-- modal -->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <img :src="product.imageUrl" class="img-fluid" alt="">
                        <blockquote class="blockquote mt-3">
                        <p class="mb-0">{{ product.content }}</p>
                        <footer class="blockquote-footer text-right">{{ product.description }}</footer>
                        </blockquote>
                        <div class="d-flex justify-content-between align-items-baseline">
                            <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
                            <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
                            <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
                        </div>
                        <select name="" class="form-control mt-3" v-model="product.num">
                            <option :value="num" v-for="num in 10" :key="num">
                                選購 {{num}} {{product.unit}}
                            </option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <div class="text-muted text-nowrap mr-3">
                            小計 <strong>{{ product.num * product.price }}</strong> 元
                        </div>
                        <button type="button" class="btn btn-primary"
                        @click="addtoCart(product.id, product.num)">
                            <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
                            加到購物車
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery';
    export default {
        data(){
            return {
                products:[],
                isLoading:false,
                product:{},
                status:{
                    loadingItem:'',
                },
                cart:{},
                coupon:'',
                cartHasValue:false,
                couponSuccess:false,
                couponEnabled:'disabled',
                //結帳
                form:{
                    user:{
                        "name": "",
                        "email": "",
                        "tel": "",
                        "address": ""
                        },
                    "message": ""
                },        
                // imageStyle:{
                //     b
                // }
            }
        },
        methods: {
            getProduct(id){
                let vm = this;
                vm.status.loadingItem = id;
                vm.$http.get(`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`).then((response) =>{
                vm.product = response.data.product;
                // console.log(vm.product.id === vm.status.loadingItem);
                // console.log(vm.status.loadingItem)
                $('#productModal').modal('show');
                vm.status.loadingItem = '';
            })
            },
            addtoCart(id,qty = 1){
                let vm = this;
                vm.$http.post(`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`,{data : {"product_id":id,qty}}).then((response) => {
                    console.log(response);
                    $('#productModal').modal('hide');
                    vm.getCart();
                });
            },
            getCart(){
                let vm = this;
                vm.$http.get(`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`).then((response) => {
                    // console.log(response);
                    vm.cart = response.data.data;
                    vm.cart.carts.length > 0 ? vm.cartHasValue = true : vm.cartHasValue = false;
                })
            },
            delCartItem(item){
                let vm = this;
                vm.$http.delete(`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${item.id}`).then((response) => {
                    vm.getCart();
                })
            },
            setCoupon(){
                let vm = this;
                vm.$http.post(`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`,{'data' : {'code': vm.coupon}}).then((response) => {
                    console.log(response.data.success);
                    response.data.success ? vm.couponSuccess = true : vm.couponSuccess = false;
                    vm.couponEnabled = 'enabled';
                    vm.getCart();
                })
            },
            sendOrder(){
                let vm = this;
                 vm.$http.post(`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`,{'data':vm.form}).then((response) => {
                     console.log(response);
                     if(response.data.success){
                         vm.$router.push(`/customer_payout/${response.data.orderId}`);
                     }
                     vm.form.user = {};
                     vm.form.message = '';
                 })
            }
        },
        created(){
            let vm = this;
            vm.isLoading=true;
            vm.$http.get(`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/all`).then((response) =>{
                vm.isLoading=false;
                vm.products = response.data.products;
            })
            vm.getCart();
        }
    }

</script>

<style>

</style>