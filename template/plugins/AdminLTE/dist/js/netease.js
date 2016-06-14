/**
 * Created by allen.hu on 15/08/11.
 */
'use strict';


$(function () {
  $('.j-package-select-form').ajaxfileupload({
    'action': '/package/upload',
    'params': {
      'extra': 'info'
    },
    'onComplete': function(response) {
      var pkg = response;
      if( typeof pkg == 'string' && pkg.startsWith('error')){
        $('.modal-body p').html(response);
        $('.modal').modal('show');
        return;
      }
      pkg.programs.forEach(function (ele, idx) {
        var text = [
          '<tr>',
          '<td>' + (ele.type == 1 ? "BLE APP" : ele.type == 2 ? "BLE SW" : ele.type == 3 ? "MCU APP" : "TOUCH APP" ) + '</td>',
          '<td>' + ele.version + '</td> ',
          '<td>' + ele.describe + '</td> ',
          '<td>' + ele.size + '</td> ',
          '<td>' + ele.md5 + '</td> ',
          '<td>' + (ele.enablediff ? "支持" : "不支持") + '</td> ',
          '<td>' + ele.blocksize + '</td>',
          '<td>' + ele.email + '</td>',
          '<td>' + '<a href="javascript:void(0);">' + '上传固件' + '<input type="file" class="j-firmware-file-select" name=' + ele.type + ' id=' + ele.type +  ' accept="application/octet-stream" required/></a>' + '</td>',
          '</tr>'
        ].join('');
        $('.j-package-items-select').append(text);
              $('.j-firmware-file-select').ajaxfileupload({
                'action': '/firmware/upload/'+ele.type,
                'params': {
                  'extra': 'info'
                },
                'onComplete': function(response) {
                  var pkg = response;
                  if( typeof pkg == 'string' && pkg.startsWith('error')){
                    $('.modal-body p').html(response);
                    $('.modal').modal('show');
                    return;
                  }
                  console.log(pkg);
                },
                'onStart': function() {
                  console.log(this);
                },
                'onCancel': function() {
                  console.log('no file selected');
                }
              });
      });
      $('.j-version-select').html(pkg.version);
      $('.j-issuer-select').html(pkg.issuer);
      $('.j-email-select').html(pkg.email);
    },
    'onStart': function() {
      console.log(this);
    },
    'onCancel': function() {
      console.log('no file selected');
    }
  });


  $('#submit').click(function(){
    $.ajax({
      url:'/issue',
      method: 'get',
      success: function(data){
          if( data  && data.hasOwnProperty('resReason') ){
            $('.modal-body p').html(data.resReason);
            $('.modal').modal('show');
          }
      },
      fail: function(data){
        if( data && data.hasOwnProperty('resReason') ){
          $('.modal-body p').html(data.resReason);
          $('.modal').modal('show');
        }
      }
    });
    return false;
  });

});
