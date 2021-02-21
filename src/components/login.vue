<template>
    <div class="form-signin">
        <form v-on:click.prevent='signin'>
            <h1 class="h3 mb-3 fw-normal">請登入驗證</h1>
            <label for="inputEmail" class="visually-hidden" >Email address</label>
            <input type="email" id="inputEmail" class="form-control" v-model="user.username" placeholder="Email address" required autofocus>
            <label for="inputPassword" class="visually-hidden">Password</label>
            <input type="password" id="inputPassword" class="form-control" v-model='user.password' placeholder="Password" required>
            <div class="checkbox mb-3">
            <label>
                <input type="checkbox" value="remember-me"> Remember me
            </label>
            </div>
            <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
            <p class="mt-5 mb-3 text-muted">&copy; 2017-2021</p>
        </form>
    </div>
</template>

<script>
    export default {
        data:function(){
            return {
                user:{
                    username:'',
                    password:'',
                }
            }
        },
        methods: {
            signin(){
            let self = this;
            this.$http.post(`${process.env.APIPATH}/admin/signin`,self.user).then((response) => {
                // console.log(response.data);
                if(response.data.success){
                    const expired = response.data.expired;
                    const token = response.data.token;
                    document.cookie = `myToken=${token}; expires=${new Date(expired)}`;
                    //會先把Dashboard元件建立完成
                    self.$router.push('/admin/products');
                };
                })
            },

        },
        
    }

</script>

<style scoped>
    html,body {
        height: 100%;
        }

        body {
        display: flex;
        align-items: center;
        padding-top: 40px;
        padding-bottom: 40px;
        background-color: #f5f5f5;
        }

        .form-signin {
        width: 100%;
        max-width: 330px;
        padding: 15px;
        margin: auto;
        }
        .form-signin .checkbox {
        font-weight: 400;
        }
        .form-signin .form-control {
        position: relative;
        box-sizing: border-box;
        height: auto;
        padding: 10px;
        font-size: 16px;
        }
        .form-signin .form-control:focus {
        z-index: 2;
        }
        .form-signin input[type="email"] {
        margin-bottom: -1px;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
        }
        .form-signin input[type="password"] {
        margin-bottom: 10px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        }
    
</style>