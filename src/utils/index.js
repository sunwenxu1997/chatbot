// 解析事件流数据
export function parseEventStream(data) {
  // 将数据按两个换行符分割成多个事件
  const events = data.split('\n\n')
  const parsedEvents = []
  events.forEach((event) => {
    if (event) {
      const lines = event.split('\n')
      let eventType = null
      let eventData = ''
      // 解析每一行，提取事件类型和数据
      lines.forEach((line) => {
        if (line.startsWith('event:')) {
          eventType = line.slice(6).trim()
        } else if (line.startsWith('data:')) {
          eventData += line.slice(5).trim()
        }
      })
      try {
        // 尝试将数据解析为 JSON 对象
        const parsedData = recursiveParseJSON(eventData)
        parsedEvents.push({
          event: eventType,
          data: parsedData
        })
      } catch (error) {
        // 如果解析失败，将数据作为普通字符串处理
        parsedEvents.push({
          event: eventType,
          data: eventData
        })
      }
    }
  })
  return parsedEvents
}

export function recursiveParseJSON(value) {
  try {
    // 尝试解析为 JSON
    const parsed = JSON.parse(value)
    if (typeof parsed === 'object' && parsed !== null) {
      // 递归处理对象的每个属性
      for (const key in parsed) {
        if (Object.prototype.hasOwnProperty.call(parsed, key)) {
          parsed[key] = recursiveParseJSON(parsed[key])
        }
      }
    }
    return parsed
  } catch (error) {
    // 解析失败，返回原数据
    return value
  }
}
