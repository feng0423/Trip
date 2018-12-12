<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>骡窝窝系统管理平台</title>
    <#include "../common/header.ftl" >
    <style>
        .modal-body img{
            width: 100%;
        }
    </style>
    <script>
        $(function () {
            //查看文章按钮
            $(".look_Btn").click(function () {
                var id = $(this).data("id");
                $.get("/travel/travelContentById.do",{id:id},function (data) {
                     $(".modal-body").html(data.content)
                })
                $("#contentModal").modal("show");
            })
            //发布文章按钮
            $(".changeState").click(function () {
                var id = $(this).data("id");
                var state = $(this).data("state");
                $.post("/travel/changeState.do",{id:id,state:state},function (data) {
                     window.location.reload()
                })
            })
        })
    </script>
</head>
<body>
<<div class="container " style="margin-top: 20px">
    <#include "../common/top.ftl">
    <div class="row">
        <div class="col-sm-3">
            <#assign currentMenu="audit_list"/>
            <#include "../common/menu.ftl">
        </div>
        <div class="col-sm-9">
            <div class="row">
                <div class="col-sm-12">
                    <h1 class="page-head-line">待审核游记</h1>
                </div>
                <!--高级查询--->
                <form class="form-inline" id="searchForm" action="/travel/list.do" method="post">
                    <input type="hidden" name="currentPage" id="currentPage" value="1"/>
                    <div class="form-group">
                        <select id="auditState" class="form-control" autocomplete="off" name="state">
                            <option value="-2">全部</option>
                            <option value="1">待审核</option>
                            <option value="-1">已拒绝</option>
                        </select>
                        <script>
                            $("#auditState").val(${(qo.state)!})
                        </script>
                        <button id="query" type="submit" class="btn btn-success"><i class="icon-search"></i> 查询</button>
                    </div>
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
                        <td>${(entity.stateName)!}</td>
                        <td>
                            <a href="javascript:void(0);" class="changeState" data-state =2  data-id="${entity.id}">发布</a>
                        </td>
                        <td>
                            <a href="javascript:void(0);" class="changeState" data-state = -1 data-id="${entity.id}" >拒绝</a>
                        </td>
                        <td>
                            <a href="javascript:void(0);" class="look_Btn" data-id="${entity.id}">查看文章</a>
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
</body>
</html>