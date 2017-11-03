const SLACK_PATH = process.env.SLACK_PATH;
const SLACK_HOST = 'hooks.slack.com';

import { SNS } from 'node-lambda-events';
import https from 'https';

const colors = {
  ok: '#36a64f',
  alarm: '#ff0000',
};

const template = {
  username: 'AWS SNS',
  text: '',
  attachments: [],
};

class Slack extends SNS {
  parseRecord({
    record: {
      Sns: {
        Subject,
      },
    },
    body: {
      AlarmDescription,
      NewStateValue,
      NewStateReason,
      Trigger: {
        Namespace,
      },
    },
  }) {
    const data = template;
    const isAlarm = NewStateValue !== 'OK';
    const text = `${isAlarm ? '@here' : ''} ${Subject} '\n' ${NewStateReason}`;
    const color = isAlarm ? colors.alarm : colors.ok;
    const priority = isAlarm ? 'High' : 'Normal';

    data.attachments = [
      {
        fallback: text,
        color,
        author_name: 'Slack SNS Service',
        title: 'SNS Service Message',
        text,
        fields: [
          {
            title: 'Priority',
            value: priority,
            short: false,
          },
        ],
        footer: 'Product API',
      },
    ];

    const channel = AlarmDescription.match(/#([-a-zA-Z0-9]+)/);
    data.channel = channel && channel.shift();

    return data;
  }

  postMessage(body) {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'POST',
        hostname: SLACK_HOST,
        port: 443,
        path: SLACK_PATH || '/',
      };

      const req = https.request(options, (res) => {
        res.setEncoding('utf8');
        res.on('data', () => {
          resolve();
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.write(JSON.stringify(body));
      req.end();
    });
  }

  each(record) {
    return new Promise((resolve, reject) => {
      let body;
      try {
        body = this.parseRecord(record);
      } catch (e) {
        reject(e);
      }

      resolve(body);
    })
    .then((body) => this.postMessage(body));
  }
}

export default SNS.wrap(Slack);