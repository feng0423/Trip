<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>骡窝窝系统管理平台</title>
    <#include "../common/header.ftl" >
    <script type="text/javascript" src="/js/My97DatePicker/WdatePicker.js"></script>
    <script type="text/javascript" src="/js/ckeditor/ckeditor.js"></script>
    <script>
        $(function () {
          $(".btn-input").click(function () {
                $("#editForm input").val("");
                $("#editForm select").val("");
                $("#coverUrl").attr("src"," ");

                //清空副文本框的内容
                if( $(this).hasClass("btn-success")){
                    ck.setData("");
                }

               // var content=$(this).data("content")
                var json = $(this).data("json");

                if (json) {
                    //回显id隐藏域
                    $("input[name='id']").val(json.id);
                    $("input[name='title']").val(json.title);
                    $("input[name='creationTime']").val(json.creationTime);
                    $("input[name='amount']").val(json.amount);
                    $("#coverUrl").attr('src',json.coverUrl);
                    $("#coverUrl").attr("width","100%");
                    $("input[name='coverUrl']").val(json.coverUrl);
                    ck.setData(json.contentContent);
                }
                $("#travelModal").modal("show");
            })
            //提交表单
            $(".btn-submit").click(function () {
                //获取副文本编辑器的内容,设置到表单组件中
                var data = ck.getData();
                $("#editor").html(data);

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
            <#assign currentMenu="news"/>
            <#include "../common/menu.ftl">
        </div>
        <div class="col-sm-9">
            <div class="row">
                <div class="col-sm-12">
                    <h1 class="page-head-line">日报管理</h1>
                </div>
                <!--高级查询--->
                <form class="form-inline" id="searchForm" action="/news/list.do" method="post">
                    <input type="hidden" name="currentPage" id="currentPage" value="1">
                    <div class="form-group">
                        <label>关键字</label>
                        <input class="form-control" type="text" name="keyword" value="${(qo.keyword)!}">
                    </div>
                    <div class="form-group">
                        <button id="query" type="submit" class="btn btn-success"><i class="icon-search"></i> 查询</button>
                    </div>
                    <a href="javascript:void(0);" class="btn btn-success btn-input" >添加</a>
                </form>
            </div>
            <table class="table table-striped table-hover">
                <thead>
                <tr>
                    <th>编号</th>
                    <th>封面</th>
                    <th>标题</th>
                    <th>创建时间</th>
                   <#-- <th>所属内容</th>-->
                    <th>浏览数量</th>
                    <th>操作</th>
                </tr>

                </thead>

                <#list pageInfo.list as entity>
                    <tr>
                        <td>${entity_index + 1}</td>
                        <td><img src="${entity.coverUrl}" width="100px"/></td>
                        <td>${entity.title}</td>
                        <td>${(entity.creationTime?string('yyyy-MM-dd HH:mm:ss'))!}</td>
                      <#--<td>${entity.newsContent.content}</td>-->
                        <td>${entity.amount}</td>
                        <td>
                            <a href="javascript:void(0);" class="btn-input"  data-json='${entity.json}'>修改</a>
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
                <h4 class="modal-title">新增日报</h4>
            </div>
            <div class="modal-body">
                <form id="editForm" class="form-horizontal" method="post" action="/news/saveOrUpdate.do"
                      enctype="multipart/form-data">
                    <input type="hidden" name="id"/>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">标题</label>
                        <div class="col-sm-6">
                            <input type="text" class="form-control" name="title">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">封面</label>
                        <div class="col-sm-6">
                            <img id="coverUrl" width="100%">
                            <input type="file" class="form-control" name="file">
                        <#--注意这里还需要增减一个隐藏域-->
                            <input type="hidden" class="form-control" name="coverUrl">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">浏览数量</label>
                        <div class="col-sm-6">
                            <input type="text" class="form-control" name="amount" >
                        </div>
                    </div>
                   <#-- <div class="form-group">
                        <label class="col-sm-4 control-label">日报内容</label>
                        <div class="col-sm-6">
                            <input type="text" class="form-control" name="newsContent.content">
                        </div>
                    </div>-->
                    <div class="form-group">
                        <label class="col-sm-4 control-label" >创建时间</label>
                        <div class="col-sm-6">
                            <input type="text" class="form-control" name="creationTime" onclick="WdatePicker()">
                        </div>
                    </div>
                    <#--副文本框-->
                    <textarea name="content.content" id="editor" rows="10" cols="80">
                    </textarea>
                    <script>
                        var ck=CKEDITOR.replace('editor');
                    </script>
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