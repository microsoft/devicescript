import * as ds from "@devicescript/core"

class MessageBroker {
    private subscriptions: {
        topic: string
        handler: (msg: any) => ds.AsyncVoid
    }[] = []

    /**
     * Subscribes a topic, handler pair
     * @param topic
     * @param handler
     */
    subscribe(topic: string, handler: (msg: any) => ds.AsyncVoid) {
        if (
            !this.subscriptions.find(
                s => s.topic === topic && s.handler === handler
            )
        )
            this.subscriptions.push({ topic, handler })
    }

    /**
     * Emits a topic message to the correspoding handlers
     **/
    async emit(topic: string, msg: any) {
        const subs = this.subscriptions.filter(s => s.topic === topic)
        for (const sub of subs) {
            const handler = sub.handler
            await handler(msg)
        }
    }
}

const ros = new ds.Ros()
ros.report().subscribe(handleReport)
let nodeName = ds.deviceIdentifier("self")
let broker: MessageBroker = new MessageBroker()

/**
 * Configures the ROS node information.
 * @param nodeName
 */
export function rosConfigure(name: string) {
    if (name === nodeName) return // same device

    nodeName = name || ds.deviceIdentifier("self")
    broker = new MessageBroker()
}

async function handleReport(pkt: ds.Packet) {
    if (pkt.isReport && pkt.serviceCommand === ds.RosCodes.ReportMessage) {
        const [topic, src] = pkt.decode()
        const msg = JSON.parse(src)
        broker.emit(topic, msg)
    }
}

/**
 * ROS message type
 * TODO: code generate message signature
 */
export type RosMessage =
    | boolean
    | number
    | {
          id: string
          foo: number
      }
    | any // escape hatch

/**
 * Subscribes to a ROS topi.
 * @param topic ROS topic
 * @param handler callback function
 * @returns callback to unsubscribe
 */
export async function rosSubscribe<T extends RosMessage>(
    topic: string,
    handler: (msg: T) => ds.AsyncVoid
): Promise<void> {
    // notify ROS service to send messages
    await ros.subscribeMessage(nodeName, topic)
    // remember handler
    broker.subscribe(topic, handler)
}

/**
 * Publishes a ROS message
 * @param topic
 * @param msg
 * @returns
 */
export async function rosPublish<T extends RosMessage>(topic: string, msg: T) {
    const src = JSON.stringify(msg)
    // send to ROS service
    await ros.publishMessage(nodeName, topic, src)
}
