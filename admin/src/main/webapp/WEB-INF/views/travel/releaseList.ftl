<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>骡窝窝系统管理平台</title>
    <#include "../common/header.ftl" >
    <script type="text/javascript" src="/js/My97DatePicker/WdatePicker.js"></script>
    <style>
        .modal-body img {
            width: 100%;
        }
    </style>
    <script>
        $(function () {

            $(".look_Btn").click(function () {
                var id = $(this).data("id");
                $.get("/travel/travelContentById.do", {id: id}, function (data) {
                    $(".modal-body").html(data.content)
                })
                $("#contentModal").modal("show");
            })
            $(".changeState").click(function () {
                var id = $(this).data("id");
                var state = $(this).data("state");
                $.post("/travel/changeState.do", {id: id, state: state}, function (data) {
                    window.location.reload()
                })
            })
            $(".travelCommend").click(function () {
                var json = $(this).data("json");
                console.log(json);
                //回显模态框数据
                $("input[name='travel.id']").val(json.id); //回显游记id的隐藏域
                $("input[name=title]").val(json.title); //回显标题
                $("input[name='coverUrl']").val(json.coverUrl); //提交表单
                $("#coverUrl").attr("src",json.coverUrl); //给人看的
                $("#travelModal").modal("show");
            })
            //提交表单
            $("#btn-submit").click(function () {
                //将表单的提交方式改为ajax异步提交
                $("#editForm").ajaxSubmit(function (data) {
                    if (data.success){
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
            <#assign currentMenu="release"/>
            <#include "../common/menu.ftl">
        </div>
        <div class="col-sm-9">
            <div class="row">
                <div class="col-sm-12">
                    <h1 class="page-head-line">已发布游记管理</h1>
                </div>
                <!--高级查询--->
                <form class="form-inline" id="searchForm" action="/travel/releaseList.do" method="post">
                    <input type="hidden" name="currentPage" id="currentPage" value="1"/>
                </form>
            </div>

            <table class="table table-striped table-hover">
                <thead>
                <tr>
                    <th>序号</th>
                    <th>标题</th>
                    <th>封面</th>
                    <th>地点</th>
                    <th>作者</th>
                    <th>发布时间</th>
                    <th>状态</th>
                </tr>
                </thead>
                <#list pageInfo.list as entity>
                    <tr>
                        <td>${entity_index+1}</td>
                        <td>${(entity.title)!}</td>
                        <td><img src="${(entity.coverUrl)!}" style="width: 30px; height: 30px"></td>
                        <td>${(entity.place.name)!}</td>
                        <td>${(entity.author.nickName)!}</td>
                        <td>${(entity.releaseTime?string('yyyy-MM-dd'))!}</td>
                        <td>${(entity.stateName)!}</td>
                        <td>
                            <a href="javascript:void(0);" class="look_Btn" data-id="${entity.id}">查看游记</a>
                        </td>
                        <td>
                            <a href="javascript:void(0);" class="changeState" data-state=1
                               data-id="${entity.id}">取消发布</a>
                        </td>
                        <td>
                            <#--json需要使用单引号-->
                            <a href="javascript:void(0);" class="travelCommend" data-json='${(entity.json)!}'>推荐</a>
                        </td>
                    </tr>
                </#list>
            </table>
           <#include "../common/page.ftl">
        </div>
    </div>
</div>
<div id="contentModal" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                        aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">查看内容</h4>
            </div>
            <div class="modal-body">
            </div>
        </div>
    </div>
</div>

<div id="travelModal" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                        aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">编辑游记标记</h4>
            </div>
            <div class="modal-body">
                <form id="editForm" class="form-horizontal" method="post" action="/travelCommend/saveOrUpdate.do" enctype="multipart/form-data">
                    <input  type="hidden" name="travel.id" />
                    <div class="form-group">
                        <label class="col-sm-4 control-label">标题</label>
                        <div class="col-sm-6">
                            <input type="text" class="form-control" name="title" >
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">副标题</label>
                        <div class="col-sm-6">
                            <input type="text" class="form-control" name="subTitle" placeholder="副标题">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">封面</label>
                        <div class="col-sm-6">
                            <img id="coverUrl">
                            <input type="file" class="form-control" name="file">
                            <#--注意这里还需要增减一个隐藏域-->
                            <input type="hidden" class="form-control" name="coverUrl" >
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label" >推荐时间</label>
                        <div class="col-sm-6">
                            <input type="text" class="form-control" name="schedule" onclick="WdatePicker()">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">推荐类型</label>
                        <div class="col-sm-6">
                            <select class="form-control" autocomplete="off" name="type" >
                                <option value="1">每月推荐</option>
                                <option value="2">每周推荐</option>
                                <option value="3">攻略推荐</option>
                            </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <a href="javascript:void(0);" class="btn btn-success" id="btn-submit" aria-hidden="true">保存</a>
                <a href="javascript:void(0);" class="btn" data-dismiss="modal" aria-hidden="true">关闭</a>
            </div>
        </div>
    </div>
</div>
</body>
</html>