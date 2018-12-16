<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>叩丁狼骡窝窝系统管理平台</title>
    <#include "../common/header.ftl" >
    <link rel="stylesheet" href="/jquery/plugins/treeview/bootstrap-treeview.min.css" type="text/css"/>
    <script type="text/javascript" src="/jquery/plugins/treeview/bootstrap-treeview.min.js"></script>

    <script>
        $(function () {
            //通过发ajax发请求查询根目录的所有地区的数据
            $.get("/region/listByParentId.do", {type: "tree"}, function (data) {
                $("#treeview").treeview({
                    data: [{text: '全部地区', nodes: data}],
                    showTags: true,
                    lazyLoad: function (node) {
                        //查询该节点下的子节点
                        $.get("/region/listByParentId.do", {parentId: node.id, type: "tree"}, function (data) {
                            //调用插件的方法添加节点(第一个参数是要添加的节点,第二个参数是要添加到哪里(父节点))
                            $("#treeview").treeview('addNode', [data, node])
                        })
                    },
                    onNodeSelected: function (event, data) {//选中节点的事件
                        $.get("/region/listByParentId.do", {parentId: data.id}, function (data) {
                            //清空tbody的内容
                            $("#regionTb tbody").empty();
                            $.each(data, function (index, ele) {
                                var tr = $("#template tr").clone(true); //记得把事件一起克隆
                                //设置内容
                                $(tr).find("td:nth-child(1)").html(index + 1);
                                $(tr).find("td:nth-child(2)").html(ele.name);
                                $(tr).find("a").attr("data-json", ele.json);
                                //判断地区的状态(如果是推荐状态)
                                if (ele.state == 1) {
                                    temp = "取消推荐";
                                    $(tr).find("a:last").html(temp)
                                }
                                $("#regionTb tbody").append(tr);
                            })
                        })
                    }
                });
            });
            //新增/编辑
            $(".btn-input").click(function () {
                //回显之前需要把之前的数据线清空
                var json = $(this).data("json");
                //编辑
                if (json) {
                    //数据回显
                    $("input[name=id]").val(json.id);
                    $("input[name=name]").val(json.name);
                    $("input[name='parent.id']").val(json.parentId);
                    $("input[name='parent.name']").val(json.parentName);
                } else {
                    //新增
                    //获取选中的节点数据
                    var treeview = $('#treeview').treeview('getSelected');
                    if (treeview.length > 0) {
                        //回显到模态框
                        $("input[name='parent.name']").val(treeview[0].text);
                        $("input[name='parent.id']").val(treeview[0].id);
                    }
                }
                $("#regionModal").modal("show");
            });
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
            //点击推荐按钮
            $(".btn-commend").click(function () {
                var json = $(this).data("json");
                var state = 1;
                if (json.state == 1) {
                    state = 0;
                }
                $.post('/region/changeState.do', {id: json.id, state: state}, function (data) {
                    if (data.success){
                        $.messager.alert("温馨提示", "操作成功,2s后关闭");
                        setTimeout(function () {
                            window.location.reload();
                        }, 2000);
                    }
                   /*     $.messager.confirm("提示","修改成功",function(){
                            window.location.reload();
                        });*/
                })
            });
        })
    </script>
</head>
<body>
<table id="template" style="display: none">
    <tr>
        <td></td>
        <td></td>
        <td>
            <a class="btn btn-warning btn-xs btn-input">
                <span class="glyphicon glyphicon-leaf"></span> 编辑
            </a>
            <a class="btn btn-warning btn-xs btn-commend">
                <span class="glyphicon glyphicon-leaf"></span> 设为推荐
            </a>
        </td>
        </td>
    </tr>
</table>
<div class="container " style="margin-top: 20px">
    <#include "../common/top.ftl">
    <div class="row">
        <div class="col-sm-3">
            <#assign currentMenu="region"/>
            <#include "../common/menu.ftl">
        </div>
        <div class="col-sm-9">
            <div class="row">
                <div class="col-sm-12">
                    <h1 class="page-head-line">旅游地区管理</h1>
                </div>
                <!--高级查询--->
                <form class="form-inline" id="searchForm" action="/region/list.do" method="post">
                    <input type="hidden" name="currentPage" id="currentPage" value="1">
                    <div class="form-group" style="margin-left: 20px">
                        <a href="javascript:void(-1);" class="btn btn-success btn-input" ">添加地区</a>
                    </div>
                </form>
            </div>
            <div class="row">
                <div class="col-sm-4">
                    <div id="treeview"></div>
                </div>
                <div class="col-sm-8">
                    <table class="table table-striped table-hover" id="regionTb">
                        <thead>
                        <tr>
                            <th>邮箱</th>
                            <th>昵称</th>
                        </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div id="regionModal" class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                            aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">编辑/增加</h4>
                </div>
                <div class="modal-body">
                    <form id="editForm" class="form-horizontal" method="post" action="/region/saveOrUpdate.do">
                        <input id="regionId" type="hidden" name="id" value=""/>
                        <div class="form-group">
                            <label class="col-sm-4 control-label">名称</label>
                            <div class="col-sm-6">
                                <input type="text" class="form-control" name="name" placeholder="地区/景区名称">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-4 control-label">上级地区</label>
                            <div class="col-sm-6">
                                <input type="text" class="form-control" name="parent.name" readonly>
                                <input type="hidden" class="form-control" name="parent.id">
                            </div>
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