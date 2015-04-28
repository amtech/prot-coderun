/**
 * Created by Administrator on 2015/4/21.
 */
angular.module('RDash')
    .factory('loginService',['User','$cookies','$window',function(User,$cookies,$window) {
        var verifyData = {
            App_id:null,
            App_key:null,
            Token:null
        }
        return {
            isLogin:function(){
                console.log('login service!')
                if(($cookies.token)==undefined) {
                    $window.location.href = "http://sso.peilong.me/html/baigoSSO/mypage/login.php?refer=http://image.peilong.me:9000";
                }
            },
            login:function(){
                verifyData.Token = $cookies.token;
                User.login({action:'islogin'},verifyData,function(c){
                    if(!c.is_login) {
                        $window.location.href = "http://sso.peilong.me/html/baigoSSO/mypage/login.php?refer=http://image.peilong.me:9000";
                    }
                },function(err){
                    $window.location.href = "http://sso.peilong.me/html/baigoSSO/mypage/login.php?refer=http://image.peilong.me:9000";
                });
            }
        }
}])