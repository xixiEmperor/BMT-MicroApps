import { Realtime, type RealtimeOptions } from '@wfynbzlx666/sdk-realtime'

export const useRealtime = () => {
  const uInfo = JSON.parse(localStorage.getItem('user'))

  // 初始化连接配置
  const options: RealtimeOptions = {
    url: 'ws://localhost:5000', //import.meta.env.WS_URL
    auth: () => {
      return localStorage.getItem('token')
    },
    user: {
      userId: uInfo.userinfo.id,
      user_role: uInfo.userinfo.role,
    },
    heartbeatInterval: 60000,
    reconnect: {
      enabled: true,
      maxAttempts: 5,
      baseMs: 1000,
      capMs: 30000,
    },
  }

  const connect = async () => {
    // 初始化配置
    Realtime.init(options)
    // 连接
    await Realtime.connect()
  }

  const disconnect = () => {
    // 断开连接，内部会自动进行心脏停跳
    Realtime.disconnect()
  }

  /**
   * 订阅主题
   * @param topic 主题
   * @param listener 回调函数，用于接收消息
   */
  const subscribe = (topic: string, listener: (data: any) => void) => {
    Realtime.subscribe(topic, listener)
  }

  /**
   * 发布消息
   * @param topic 主题
   * @param data 消息
   */
  const publish = (topic: string, data: any) => {
    Realtime.publish(topic, data)
  }

  /**
   * 监听连接状态变化
   * @param listener 回调函数，用于接收连接状态变化
   */
  const onConnectionChange = (listener: (data: any) => void) => {
    Realtime.onConnectionChange(listener)
  }

  /**
   * 获取连接状态
   * @returns 连接状态
   */
  const getStatus = () => {
    return Realtime.getStatus()
  }

  /**
   * 获取连接统计信息
   * @returns 连接统计信息
   */
  const getStats = () => {
    return Realtime.getStats()
  }

  return {
    connect,
    disconnect,
    subscribe,
    publish,
    onConnectionChange,
    getStatus,
    getStats,
  }
}
