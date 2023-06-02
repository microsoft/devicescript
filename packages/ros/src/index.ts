import * as ds from "@devicescript/core"

/**
 * ROS message type
 */
export type RosMessage = boolean | number | any

/**
 * Subscribes to a ROS topi.
 * @param topic ROS topic
 * @param handler callback function
 * @returns callback to unsubscribe
 */
export function rosSubscribe<T extends RosMessage>(
    topic: string,
    handler: (msg: T) => ds.AsyncVoid
): ds.Unsubscribe {
    //
    return undefined
}

/**
 * Publishes a ROS message
 * @param topic
 * @param msg
 * @returns
 */
export function rosPublish<T extends RosMessage>(
    topic: string,
    msg: T
): ds.AsyncVoid {
    //
    return undefined
}
