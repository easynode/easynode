var assert = require('assert');
var logger = using('easynode.framework.Logger').forFile(__filename);
var GenericObject = using('easynode.GenericObject');

(function() {

  /**
   * Class Binary
   *
   * @class easynode.framework.util.Binary
   * @extends easynode.GenericObject
   * @since 0.1.0
   * @author hujiabao
   * */
  class Binary extends GenericObject {

    /**
     * 构造函数。
     *
     * @method 构造函数
     * @since 0.1.0
     * @author hujiabao
     * */
    constructor() {
      super();
      // 调用super()后再定义子类成员。
    }

    /**
     * 双字节，Big Endian转Little Endian
     *
     * @method wordBE2LE
     * @param {WORD} wordBE 双字节 - Big Endian
     * @return {WORD} Little Endian
     * @since 0.1.0
     * @author hujiabao
     * */
    static wordBE2LE(wordBE) {
      var b1 = wordBE & 0xFF00;
      var b2 = wordBE & 0xFF;
      return b2 << 8 | b1;
    }

    /**
     * 双字节，Little Endian转Big Endian
     *
     * @method wordLE2BE
     * @param {WORD} wordLE 双字节 - Little Endian
     * @return {WORD} Big Endian
     * @since 0.1.0
     * @author hujiabao
     * */
    static wordLE2BE(wordLE) {
      var b1 = wordLE & 0xFF00;
      var b2 = wordLE & 0xFF;
      return b2 << 8 | b1;
    }

    /**
     * 四字节，Big Endian转Little Endian
     *
     * @method dwordBE2LE
     * @param {DWORD} dwordBE 四字节 - Big Endian
     * @return {DWORD} Little Endian
     * @since 0.1.0
     * @author hujiabao
     * */
    static dwordBE2LE(dwordBE) {
      var b1 = dwordBE & 0xFF000000;
      var b2 = dwordBE & 0xFF0000;
      var b3 = dwordBE & 0xFF00;
      var b4 = dwordBE & 0xFF;
      return b4 << 24 | b3 << 16 | b2 << 8 | b1;
    }

    /**
     * 四字节，Little Endian转Big Endian
     *
     * @method dwordLE2BE
     * @param {DWORD} dwordLE 四字节 - Little Endian
     * @return {DWORD} Big Endian
     * @since 0.1.0
     * @author hujiabao
     * */
    static dwordLE2BE(dwordLE) {
      var b1 = dwordLE & 0xFF000000;
      var b2 = dwordLE & 0xFF0000;
      var b3 = dwordLE & 0xFF00;
      var b4 = dwordLE & 0xFF;
      return b4 << 24 | b3 << 16 | b2 << 8 | b1;
    }

    /**
     * 返回指定字节的第pos位是0还是1。
     *
     * @method bit
     * @param {number} number 数值
     * @param {int} pos 第x位，1 - 32
     * @return {int} 0/1
     * @since 0.1.0
     * @author hujiabao
     * */
    static bit(number, pos) {
      return number >>> (pos - 1) & 0x01;
    }

    /**
     * 返回指定字节的第posStart位至posEnd的数值。
     * 0x67 = 01100111;
     * bits(0x67, 3, 5) => 001 => 1,从低位数起
     *
     * @method bit
     * @param {number} number 数值
     * @param {int} posStart 起始位置，从低位数起,1 - 32, include
     * @param {int} posEnd 结束位置，1 - 32, include
     * @return {int} 数值, 100返回4, 010返回2.
     * @since 0.1.0
     * @author hujiabao
     * */
    static bits(number, posStart, posEnd) {
      var ret = 0;
      var idx = 0;
      var max = posEnd - posStart;
      for (var i = posEnd; i >= posStart; i--) {
        var bit = Binary.bit(number, i);
        ret |= bit << (max - idx);
        idx++;
      }
      return ret;
    }

    /**
     * 设定指定字节的第pos的值为1或0。
     * 0x67 = 01100111;
     * bitSet(0x67, 4, 1) => 01110111 => 119
     *
     * @method bit
     * @param {number} number 数值
     * @param {int} pos 从低位数起,1 - 32, include
     * @return {int} 数值, 100返回4, 010返回2.
     * @since 0.1.0
     * @author hujiabao
     * */
    static bitSet(number, pos, val) {
      val = (val === 1 || val === true || val === '1') ? 1 : 0;
      return number | (val << pos);
    }

    /*
    * bug, useless
    * */
    static bitSets(number, posStart, posEnd, val) {
      var max = Math.pow(2, posEnd - posStart) + 1;
      val = Math.min(max, val);
      return number | (val << (posStart - 1));
    }

    /**
     * writeBuffer2Array
     *
     * @method writeBuffer2Array
     * @param {Buffer} buffer 缓冲区
     * @param {int} length 长度
     * @param {Array} array 数组
     * @since 0.1.0
     * @author hujiabao
     * */
    static writeBuffer2Array(buffer, length, array) {
      for (var i = 0; i < length; i++) {
        array.push(buffer.readUInt8(i));
      }
    }

    /**
     * 返回表示一个日期的byte数组[年,月,日]。日期年份 = 实际年份  - 2000
     *
     * @method date2Bytes
     * @param {Date} d 日期，不传时使用系统当前时间
     * @return {Array} [年,月,日]  例：[0x0F, 0x05, 0x03] 表示 2015年5月3日
     * @since 0.1.0
     * @author hujiabao
     * */
    static date2Bytes(d = new Date()) {
      var year = d.getFullYear() - 2000;
      var month = d.getMonth() + 1;
      var day = d.getDate();
      return [year, month, day];
    }

    /**
     * 返回表示一个日期时间的byte数组[年,月,日,时,分,秒]。日期年份 = 实际年份  - 2000
     *
     * @method datetime2Bytes
     * @param {Date} d 日期，不传时使用系统当前时间
     * @return {Array} [年,月,日]  例：[0x0F, 0x05, 0x03, 0x10, 0x00, 0x00] 表示 2015年5月3日 16:00:00
     * @since 0.1.0
     * @author hujiabao
     * */
    static datetime2Bytes(d = new Date()) {
      var year = d.getFullYear() - 2000;
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var hours = d.getHours();
      var minutes = d.getMinutes();
      var seconds = d.getSeconds();
      return [year, month, day, hours, minutes, seconds];
    }

    getClassName() {
      return EasyNode.namespace(__filename);
    }

  }

  module.exports = Binary;
})();
