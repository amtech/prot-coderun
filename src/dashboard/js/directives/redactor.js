/**
 * Created by zpl on 15-4-23.
 */

angular
    .module('RDash')
    .directive('redactor', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {

            // Expose scope var with loaded state of Redactor
            scope.redactorLoaded = false;

            var updateModel = function updateModel(value) {
                    // $timeout to avoid $digest collision
                    $timeout(function() {
                        scope.$apply(function() {
                            ngModel.$setViewValue(value);
                        });
                    });
                },
                options = {
                    changeCallback: updateModel,
                },
                additionalOptions = attrs.redactor ?
                    scope.$eval(attrs.redactor) : {},
                editor,
                $_element = angular.element(element);
            RELANG = new Array()
            RELANG['zh_cn'] =
            {
                html: 'HTML代码',
                video: '视频',
                image: '图片',
                table: '表格',
                link: '链接',
                link_insert: '插入链接',
                link_edit: 'Edit link',
                unlink: '取消链接',
                formatting: '样式',
                paragraph: '段落',
                quote: '引用',
                code: '代码',
                header1: '一级标题',
                header2: '二级标题',
                header3: '三级标题',
                header4: '四级标题',
                header5: 'Header 5',
                bold:  '粗体',
                italic: '斜体',
                fontcolor: '字体颜色',
                backcolor: '背景颜色',
                unorderedlist: '项目编号',
                orderedlist: '数字编号',
                outdent: '减少缩进',
                indent: '增加缩进',
                cancel: '取消',
                insert: '插入',
                save: '保存',
                _delete: '删除',
                insert_table: '插入表格',
                insert_row_above: '在上方插入',
                insert_row_below: '在下方插入',
                insert_column_left: '在左侧插入',
                insert_column_right: '在右侧插入',
                delete_column: '删除整列',
                delete_row: '删除整行',
                delete_table: '删除表格',
                rows: '行',
                columns: '列',
                add_head: '添加标题',
                delete_head: '删除标题',
                title: '标题',
                image_position: '位置',
                none: '无',
                left: '左',
                right: '右',
                image_web_link: '图片网页链接',
                text: '文本',
                mailto: '邮箱',
                web: '网址',
                video_html_code: '视频嵌入代码',
                file: '文件',
                upload: '上传',
                download: '下载',
                choose: '选择',
                or_choose: '或选择',
                drop_file_here: '将文件拖拽至此区域',
                align_left:	'左对齐',
                align_center: '居中',
                align_right: '右对齐',
                align_justify: '两端对齐',
                horizontalrule: '水平线',
                fullscreen: '全屏',
                deleted: '删除',
                anchor: '锚点',
                link_new_tab: 'Open link in new tab',
                underline: 'Underline',
                alignment: 'Alignment',
                filename: 'Name (optional)',
                edit: 'Edit',
                center: 'Center'
            };
            angular.extend(options, scope.redactorOptions, additionalOptions);
            // prevent collision with the constant values on ChangeCallback
            RedactorPlugins = {};

            RedactorPlugins.advanced = function()
            {
                return {
                    init: function()
                    {
                        var button = this.button.add('advanced', 'Advanced');

                        // make your added button as Font Awesome's icon
                        this.button.setAwesome('advanced', 'fa-tasks');

                        this.button.addCallback(button, this.advanced.testButton);
                    },
                    testButton: function(buttonName)
                    {
                        alert(buttonName);
                    }
                };
            };
            options.plugins = ['advanced'];

            var changeCallback = additionalOptions.changeCallback || scope.redactorOptions.changeCallback;
            if (changeCallback) {
                options.changeCallback = function(value) {
                    updateModel.call(this, value);
                    changeCallback.call(this, value);
                }
            }

            // put in timeout to avoid $digest collision.  call render() to
            // set the initial value.
            $timeout(function() {
                editor = $_element.redactor(options);
                scope.flag.editor = $_element
                ngModel.$render();
            });

            ngModel.$render = function() {
                if(angular.isDefined(editor)) {
                    $timeout(function() {
                        $_element.redactor('code.set', ngModel.$viewValue || '');
                        $_element.redactor('placeholder.toggle');
                        scope.redactorLoaded = true;
                    });
                }
            };
        }
    };
}])