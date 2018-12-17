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
            //点击保存
            $("#editForm").ajaxForm(function (data) {
                $.messager.confirm("提示", "保存成功", function () {
                    window.location.reload();
                });
            });
            $(".btn-submit").click(function () {
                $("#editForm").submit();
            });

            //点击修改按钮
            $(".btn-input").click(function () {
                //回显
                var id = $(this).data("id");
                var state = $(this).data("state");
                console.log(id);
                console.log(state);
                $("#strategyCommentId").val(id);
                $("select[name=state]").val(state);
                $("#travelModal").modal("show");
            });

            //图片展示
            var imgUrls = $(".imgUrls");
            console.log(imgUrls);
            for (var k = 0; k < imgUrls.length; k++) {
                var temp = $(imgUrls[k]);
                var imgs = temp.html().split(";");
                temp.empty();
                for (var i = 0; i < imgs.length; i++) {
                    temp.append("<img src='" + imgs[i] + "' width='50px' style='margin-right:5px'/>");
                }
            }
        })


    </script>
</head>
<body>
<div class="container " style="margin-top: 20px">
    <#include "../common/top.ftl">
    <div class="row">
        <div class="col-sm-3">
            <#assign currentMenu="strategyComment"/>
            <#include "../common/menu.ftl">
        </div>
        <div class="col-sm-9">
            <div class="row">
                <div class="col-sm-12">
                    <h1 class="page-head-line">攻略评论管理</h1>
                </div>
                <!--高级查询--->
                <form class="form-inline" id="searchForm" action="/strategyComment/list.do" method="post">
                    <input type="hidden" name="currentPage" id="currentPage" value="1">

                </form>
            </div>
            <table class="table table-striped table-hover">
                <thead>
                <tr>
                    <th>序列</th>
                    <th>评论者</th>
                    <th>时间</th>
                    <th>图片</th>
                    <th>星星</th>
                    <th>攻略</th>
                    <th>状态</th>
                    <th width="30%">内容</th>
                </tr>
                </thead>
               <#list pageInfo.list as entity>
                    <tr>
                       <td>${entity_index + 1}</td>
                        <td>${entity.user.nickName}</td>
                        <td>${(entity.createTime?string('yyyy-MM-dd HH:mm:ss'))!}</td>
                        <td class="imgUrls">${entity.imgUrls}</td> <#--src="${entity.imgUrls}"-->
                        <td>${entity.starNum}</td>
                        <td>${(entity.strategy.title)!}</td>
                        <td>${(entity.stateName)!}</td>
                        <td>${entity.content}</td>
                       <td>
                            <a href="javascript:void(0);" class="btn-input"  data-state ="${entity.state}"  data-id="${entity.id}">修改状态</a>

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
                <h4 class="modal-title">修改状态状态</h4>
            </div>
            <div class="modal-body">
                <form id="editForm" class="form-horizontal" method="post" action="/strategyComment/changeState.do"
                      enctype="multipart/form-data">
                    <input type="hidden" name="id" id="strategyCommentId"/>
                    <div class="form-group">
                        <label class="col-sm-4 control-label">状态</label>
                        <div class="col-sm-6">
                            <select id="auditState" class="form-control" autocomplete="off" name="state">
                                <option value="0">正常</option>
                                <option value="1">推荐</option>
                                <option value="-1">禁用</option>
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