/**
 * Created by zpl on 15-4-8.
 */
angular
    .module('RDash')
    .controller('NewStepCtrl', ['$scope','$stateParams','MyCodeService','ngDialog', NewStepCtrl]);

function NewStepCtrl($scope,$stateParams,MyCodeService,ngDialog){
    $scope.newstep = {
        meta:{},
        cmds:[]
    };
    $scope.cmd = {
        is_replace:-1
    };
    $scope.stepinfo = {
        is_created:false,
        msg:"正在为您创建中，请稍等。。。",
        data:null
    };
    var stepid = $stateParams.stepid;
    var codeid = $stateParams.codeid;
    if(stepid != null){
        MyCodeService.getMyCodeOneStep(codeid,stepid,function(data){
            if(data == null){
                $location.path('/code/'+codeid);
                return
            }else{
                $scope.newstep = data;
                for(var i =0;i<data.cmds.length;i++){
                    if(data.cmds[i].Is_replace == 2){
                        $scope.cmd.is_replace = i;
                        break;
                    }
                }
            }
        })
    }else{
        $scope.newstep = {
            meta:{
                id:"",
                name:"",
                description:"",
                code_name:"",
                image_id:0,
                code_id:parseInt(codeid)
            },
            cmds:[
                    {Seq:1,Cmd:"",Args:"",Is_replace:1},
                    {Seq:2,Cmd:"",Args:"",Is_replace:1},
                    {Seq:3,Cmd:"",Args:"",Is_replace:1},
                    {Seq:4,Cmd:"",Args:"",Is_replace:1}
                ]
        };
    }

    $scope.next = function(){
        if ($scope.step.$invalid) {
            return false;
        }
        return true;
    }

    $scope.addCmd = function(){
        $scope.newstep.cmds.push({cmd:"",args:"",is_replace:false});
    }
    $scope.removeCmd = function(i){
        $scope.newstep.cmds[i] = {
            seq:0,
            cmd:"",
            args:"",
            is_replace:1
        }
        if(i == $scope.cmd.is_replace){
            $scope.cmd.is_replace = -1;
        }
    }
    $scope.upCmd = function(i){
        if(i >0){
            var tmp = $scope.newstep.cmds[i-1];
            $scope.newstep.cmds[i-1] = $scope.newstep.cmds[i];
            $scope.newstep.cmds[i] = tmp;
            var seq = $scope.newstep.cmds[i-1].seq;
            $scope.newstep.cmds[i-1].seq = $scope.newstep.cmds[i].seq;
            $scope.newstep.cmds[i].seq = seq;
        }
    }
    $scope.downCmd = function(i){
        var len = $scope.newstep.cmds.length;
        if(i< len-1){
            var tmp = $scope.newstep.cmds[i+1];
            $scope.newstep.cmds[i+1] = $scope.newstep.cmds[i];
            $scope.newstep.cmds[i] = tmp;
            var seq = $scope.newstep.cmds[i+1].seq;
            $scope.newstep.cmds[i+1].seq = $scope.newstep.cmds[i].seq;
            $scope.newstep.cmds[i].seq = seq;
        }
    }


    $scope.stepconfig ={
        headerTag: "h3",
        bodyTag: "fieldset",
        transitionEffect: "slideLeft",
        onStepChanging: function (event, currentIndex, newIndex)
        {
            // Allways allow previous action even if the current form is not valid!
            if (currentIndex > newIndex)
            {
                if(newIndex == 0){
                    $scope.stepinfo.is_created=false;

                    $scope.stepinfo.msg="正在为您创建中，请稍等。。。";
                }

                return true;
            }
            if(currentIndex == 0){
                if($scope.newstep.name == ""||$scope.newstep.description == "" || $scope.newstep.image_id == 0){
                    alert("请填写好表单");
                    return false;
                }
                MyCodeService.addMyCodeStep($stateParams.codeid,$scope.newstep.meta,function(data){
                    console.log(data);
                    //dialog.close();
                    if(data == null){
                        $scope.stepinfo.msg="服务器装逼被雷劈了。。。，请稍后在找它";
                    }else{
                        $scope.stepinfo.data = data;
                        $scope.stepinfo.is_created = true;
                        $scope.stepinfo.data = data;
                    }
                })

                return true;
            }
            if(currentIndex == 1){
                $scope.stepinfo.is_created = false;
                $scope.newstep.cmds[$scope.cmd.is_replace].Is_replace =2;
                if($scope.stepinfo.data.id == null){
                    $scope.stepinfo.is_created = false;
                    $scope.stepinfo.msg="创建失败，请回退到第一步重来吧";
                    return false;
                }
                MyCodeService.addMyCodeStepCmd($stateParams.codeid,$scope.stepinfo.data.id,$scope.newstep.cmds,function(data){
                    console.log(data);
                    if(data == null){
                        $scope.stepinfo.msg="服务器装逼被雷劈了。。。，请稍后在找它";
                    }else{
                        $scope.stepinfo.msg="创建已经成功";

                        $scope.stepinfo.is_created = true;
                    }
                })
            }
            return true;
        },
        onStepChanged: function (event, currentIndex, priorIndex)
        {
            //// Used to skip the "Warning" step if the user is old enough.
            //if (currentIndex === 2 && Number($("#age-2").val()) >= 18)
            //{
            //    form.steps("next");
            //}
            //// Used to skip the "Warning" step if the user is old enough and wants to the previous step.
            //if (currentIndex === 2 && priorIndex === 3)
            //{
            //    form.steps("previous");
            //}
        },
        onFinishing: function (event, currentIndex)
        {
            return true;
        },
        onFinished: function (event, currentIndex)
        {
            alert("Submitted!");
        }
    }
    $('#step-create').steps($scope.stepconfig);

}