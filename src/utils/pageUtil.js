
/**
 * 分页彩虹算法<br>
 * 通过传入的信息，生成一个分页列表显示
 * [4,5,6,7,8]
 * @param currentPage 当前页
 * @param pageCount 总页数
 * @param displayCount 每屏展示的页数
 * @return 分页条
 */
const rainbow = (currentPage, pageCount, displayCount = 5) => {
  var isEven = true;
  isEven = displayCount % 2 == 0;
  var left = displayCount / 2;
  var right = displayCount / 2;

  var length = displayCount;
  if (isEven) {
    right++;
  }
  if (pageCount < displayCount) {
    length = pageCount;
  }
  var result = new Array(length);
  if (pageCount >= displayCount) {
    if (currentPage <= left) {
      for (var i = 0; i < result.length; i++) {
        result[i] = i + 1;
      }
    } else if (currentPage > pageCount - right) {
      for (var i = 0; i < result.length; i++) {
        result[i] = i + pageCount - displayCount + 1;
      }
    } else {
      for (var i = 0; i < result.length; i++) {
        result[i] = i + currentPage - left + (isEven ? 1 : 0);
      }
    }
  } else {
    for (var i = 0; i < result.length; i++) {
      result[i] = i + 1;
    }
  }
  var ceilResult = []
  result.forEach(resultItem => {
    ceilResult.push(Math.ceil(resultItem))
  })
  return ceilResult;
}


/**
 * 基于分页彩虹算法之上生成分页带 '...' 的分页算法<br>
 * 通过传入的信息，生成一个分页列表显示
 * 
 * [1, '...',4,5,6,7,8, '...', 10]
 * @param currentPage 当前页
 * @param pageCount 总页数
 * @param displayCount 每屏展示的页数
 * @return 分页条
 */
const rainbowWithDot = (currentPage, pageCount, displayCount = 5) => {
  var rainbowResult = rainbow(currentPage, pageCount, displayCount)
  var rainbowResultLength = rainbowResult.length
  // 如果页数足够小，直接返回展示的页数
  if (rainbowResultLength < displayCount) {
    return rainbowResult
  }

  var result = []
  if (rainbowResult[0] === 2) {
    result.push(1)
  }
  if (rainbowResult[0] > 2) {
    result.push(1)
    result.push('...')
  }
  result = result.concat(rainbowResult)
  if (rainbowResult[rainbowResultLength - 1] === pageCount - 1) {
    result.push(pageCount)
  }

  if (rainbowResult[rainbowResultLength - 1] < pageCount - 1) {
    result.push('...')
    result.push(pageCount)
  }
  return result
}


module.exports = {
  rainbow: rainbow,
  rainbowWithDot: rainbowWithDot
}
