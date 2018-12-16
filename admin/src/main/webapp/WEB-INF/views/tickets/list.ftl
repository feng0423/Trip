<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>骡窝窝系统管理平台</title>
    <#include "../common/header.ftl" >
    <script type="text/javascript" src="/js/My97DatePicker/WdatePicker.js"></script>
    <script>
        $(function () {
            $(".btn-input").click(function () {
                $("#editForm input").val("");
                $("#editForm select").val("");
                $("#coverurl").attr("src","");
                $("#coverurl").attr("width","");
                var json = $(this).data("json");
                if (json) {
                    //回显id隐藏域
                    $("input[name='id']").val(json.id);
                    $("input[name='name']").val(json.name);
                    $("input[name='price']").val(json.price);
                    $("select[name='state']").val(json.state);
                    $("select[name='type']").val(json.type);
                    $("input[name='coverurl']").val(json.coverurl); //提交表单
                    $("#coverurl").attr('src', json.coverurl); //给人看的
                    console.log(json.coverurl);
                    $("#coverurl").attr("width","100%");
                }
                $("#travelModal").modal("show");
            })

            /*删除订单js*/
            //1.点击按钮就调用回调函数
             $(".btn-delete").click(function() {
                 //2.data的参数获取url的参数  获取到删除按钮的url的  调用方法
                 var url=$(this).data("url");

                 //3.使用确认函数框 "你确认要删除吗?" 字符串类型
                 $.messager.confirm("温馨提示","你确认要删除吗?",function (data) {

                     //4.$.get(‘url’,data)提交函数data
                     $.get(url,function(data){

                         //5.判断如果成功就定时器，2s结束
                         if(data.success){
                             // alert("亲，操作成功")  messager 是一个 信息提示框
                             $.messager.alert("温馨提示","保存成功")
                             //定时器，如果有成功后，2s就刷新页面
                             setTimeout(function(){
                                 window.location.reload();
                             },2000);
                         }
                     })
                 })
             })

            //提交表单
            $(".btn-submit").click(function () {
                //将表单的提交方式改为ajax异步提交
                $("#editForm").ajaxSubmit(function (data) {
                    if (data.success) {
                        $.messager.alert("温馨提示", "操作成功,2s后关闭");
                        setTimeout(function () {
                            window.location.reload();
                        }, 2000);
                    }
                })
            });
        })

    </script>
</head>
<body>
<div class="container " style="margin-top: 20px">
    <#include "../common/top.ftl">
    <div class="row">
        <div class="col-sm-3">
            <#assign currentMenu="tickets"/>
            <#include "../common/menu.ftl">
        </div>
        <div class="col-sm-9">
            <div class="row">
                <div class="col-sm-12">
                    <h1 class="page-head-line">旅游景点门票管理</h1>
                </div>
                <!--高级查询--->
                <form class="form-inline" id="searchForm" action="/tickets/list.do" method="post">
                    <input type="hidden" name="currentPage" id="currentPage" value="1">
                    <div class="form-group">
                        <label>关键字</label>
                        <input class="form-control" type="text" name="keyword" value="${(qo.keyword)!}">
                    </div>
                    <div class="form-group">
                        <button id="query" type="submit" class="btn btn-success"><i class="icon-search"></i> 查询</button>
                    </div>
                    <a href="javascript:void(0);" class="btn btn-success btn-input">添加</a>
                </form>
            </div>
            <table class="table table-striped table-hover">
                <thead>
                <tr>
                    <th>编号</th>
                    <th>景点名称</th>
                    <th>价格</th>
                    <th>封面</th>
                    <th>状态</th>
                    <th>票价类型</th>
                    <th>操作</th>
                </tr>

                </thead>

                <#list pageInfo.list as entity>
                    <tr>
                        <td>${entity_index + 1}</td>
                        <td>${entity.name}</td>
                        <td>${entity.price!}</td>
                        <td><img src="${entity.coverurl}" width="100px"/></td>
                        <td>${entity.state}</td>
                        <td>${entity.type}</td>

                        <td>
                         <a href="javascript:void(0);" class="btn-input" data-json='${entity.json}'>修改</a>
                        </td>

                        <td>
                            <a href="javascript:;" data-url="/tickets/delete.do?id=${entity.id}" class="btn-delete">删除</a>
                        </td>
                    </tr>
                </#list>
            </table>
          <#include "../common/page.ftl">
        </div>
    </div>
</div>
<#--编辑模态框-->
<div id="travelModal" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                        aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">新增景点门票</h4>
            </div>
            <div class="modal-body">
                <form id="editForm" class="form-horizontal" method="post" action="/tickets/saveOrUpdate.do"
                      enctype="multipart/form-data">
                    <input type="hidden" name="id"/>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">景点名称</label>
                        <div class="col-sm-6">
                            <input type="text" class="form-control" name="name">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">票价</label>
                        <div class="col-sm-6">
                            <input type="text" class="form-control" name="price" placeholder="票价">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">封面</label>
                        <div class="col-sm-6">
                            <img id="coverurl" width="100%">
                            <input type="file" class="form-control" name="file">
                        <#--注意这里还需要增减一个隐藏域-->
                            <input type="hidden" class="form-control" name="coverurl">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">门票状态</label>
                        <div class="col-sm-6">
                            <select id="auditState" class="form-control" autocomplete="off" name="state">

                                <option value="0">普通</option>
                                <option value="1">热门</option>
                                <option value="-1">禁用</option>

                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">门票类型：</label>
                        <div class="col-sm-6">
                            <select id="auditState" class="form-control" autocomplete="off" name="type" >
                                <option value="1">综合排序</option>
                                <option value="2">价格从高到底</option>
                                <option value="3">价格从底到高</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary btn-submit">保存</button>
            </div>
        </div>
    </div>
</div>
</body>
</html>