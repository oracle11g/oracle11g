/**
 * Created by 易成波 on 2014-6-18.
 */
!function( $ ) { 
	var FollowMe = function( e, options ) {
		this.obj = e;
		this.options = options;
	}

    FollowMe.prototype = {
        /**
         * 启动引导页面导航
         */
		start: function() {
			       this.modal( true );//打开遮罩
			       this.closebtn( true );//关闭按钮
			       this.go(1);//进入第一步
		       },
        /**
         * 创建并控制close按钮
         * isShow:是否显示close按钮
         */
		closebtn: function(isShow ) {
				  var _self = this;
				  if ( isShow) {
					  if ( $('#guide-close-btn').length > 0 ) {
						  $('#guide-close-btn').fadeIn();
					  } else {
						  $('<a></a>').attr('id', 'guide-close-btn')
							  .attr('class', 'guide-close-btn')
							  .attr('href', 'javascript:void(0);')
							  .attr('title', '关闭引导')
							  .css({
								  'position' : 'absolute',
								  'top' : '25px',
								  'right' : '25px',
								  'z-index' : 1000,
								  'font-size' : '35px',
								  'font-weight' : 'bold',
								  'color' : '#FFF'
							  }).html('X')
                              .appendTo('body');
						  $('#guide-close-btn').bind('click', function(){
                              _self.clear();
                              _self.closebtn( false );
                              _self.modal( false );
						  });
					  }
				  } else {
					 $('#guide-close-btn').remove();
				  }
			  },
        /**
         * 创建遮罩
         * isShow:是否显示遮罩
         */
		modal: function( isShow ) {
			       if ( isShow ) {
				       if ( $('#guide-cover').length == 0 ) {
					       $('<div></div>')
						       .attr('id', 'guide-cover')
						       .css({
							       'position' : 'absolute',
                                   'background' : '#000',
                                   'top' : 0,
                                   'left' : 0,
                                   'width' : '100%',
                                   'height' : '100%',
                                   'opacity' : '0.4',
                                   'z-index' : 999
						       })
					       .appendTo('body');
				       } else {
					       $('#guide-cover').show();
				       }
			       } else {
				       $('#guide-cover').remove();
			       }
		       },
        /**
         *跳转到第几步
         * */
		go: function(step) {
			    var ele = this.options.ele;
			    if ( step > ele.length ) return false;
			    this.highlight( ele[step - 1] );
			    this.options.current = step + 1;
			    $(this.obj).data('guide-object', this);
		    },
        /**
         * 清除上一步的样式（前几步的样式）
         * */
		clear: function() {
			       $('.clone-step-ele').remove();
			       $('.guide-tip').remove();
		       },
        /**
         *高亮显示内容
         * */
		highlight: function( id ) {
				   this.clear();
				   var _self = this;
				   var current = _self.options.current;
				   var offset = $(id).offset();
				   var clone_tmp = $(id).clone().attr('id', 'clone-step-ele' + current).addClass('clone-step-ele');
				   $(clone_tmp).css({
					   'z-index' : 1000,
					   'position' : 'absolute',
					   'left' : offset.left,
					   'top' : offset.top
				   }).appendTo('body');
				   var title_start = '<h3 class="alert-heading">',
				       title_end = '</h3>',
				       img_start = '<p>',
				       img_end = '</p>',
				       txt_start = '<p style="width: 650px;">',
				       txt_end = '</p>',
				       tip_html = '',
				       title_html = '',
				       img_html = '',
				       txt_html = '',
				       title = _self.options.title[current-1],
				       txt = _self.options.txt[current-1],
				       img = _self.options.img[current-1];
				   if ( title ) title_html = title_start + title + title_end;
				   if ( img ) img_html = img_start + '<img src="' + img + '">' + img_end;
				   if ( txt ) txt_html = txt_start + txt + txt_end;
				   tip_html = title_html + img_html + txt_html;
				   var div = $('<div></div>');
				   div.append( tip_html )
					   .addClass('guide-tip')
					   .attr('id', 'guide-tip' + current)
					   .css({
						   'padding' : '5px',
						   'background' : '#FFF',
						   'border' : '1px #000 solid',
						   'box-shadow' : '2px 2px 10px #000',
						   'z-index' : 1000,
						   'position' : 'absolute',
						   'left' : offset.left + $(clone_tmp).outerWidth() + 5,
						   'top' : offset.top,
						   'visibility' : 'hidden'
					   }).appendTo('body');
				   $(clone_tmp).bind('click',function(){
                       _self.next();
				   });
				   div.find('img').bind('load', function(){
                       _self.adjust();
				   });
			   },
        /**
         * 自适应屏幕
         * */
		adjust: function() {
				var current = this.options.current - 1,
				clone_btn = $('#clone-step-ele' + current ),
				tip_div = $('#guide-tip' + current),
				tip_img = tip_div.find('img'),
				screen_w = $(window).width(),
				screen_h = $(window).height();

				var tip_div_offset = tip_div.offset(),
				    visible_width = tip_div.outerWidth() + tip_div_offset.left,
				    visible_height = tip_div.outerHeight() + tip_div_offset.top;
				if ( visible_width > screen_w ) {
					tip_div.css({
						'left' : tip_div_offset.left - 10 - clone_btn.outerWidth() - tip_div.outerWidth()
					});
				}
				if ( visible_height > screen_h ) {
					tip_div.css({
						'top' : tip_div_offset.top - tip_div.outerHeight() + clone_btn.outerHeight()
					});
				}
				tip_div.css({
					'visibility' : 'visible'
				});
			},
        /**
         * 下一步
         * */
		next: function(){
			      var _self = this,
			      current = _self.options.current,
			      total = _self.options.ele.length;
			      if ( current > total ) {
				      this.clear();
				      this.closebtn( false );
				      this.modal( false );
			      } else {
				      this.go( current );
			      }
		      }
	}


	$.fn.followMe = function(options) {
		var g = new FollowMe( this, $.extend({}, $.fn.followMe.defaults ,options ) );
		$(this).data('guide-object', g);
		return g;
	}
    /**
     * 默认值设置
     * */
	$.fn.followMe.defaults = {
		ele : ['#step1', '#step2', '#step3'],
		img : [],
		title : [],
		txt : [],
		current : 1
	}

}( window.jQuery);