/**
 * @format
 */

import {AppRegistry} from 'react-native';
import 'react-native-gesture-handler';
import App from './App';
import {name as appName} from './app.json';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { URLStateProvider } from './Store';

{
/* import { createClient, AnalyticsProvider } from '@segment/analytics-react-native';
import FullStory from '@fullstory/react-native';
import { FullStoryPlugin } from '@fullstory/segment-react-native-plugin-fullstory';
import { Logger } from './src/plugins/Logger';

const segmentClient = createClient({
  writeKey: 'vXapswsWAKjW2FHvbM0WeeBZUwiy35pU',
  trackAppLifecycleEvents: true,
  collectDeviceId: true,
  debug: true,
  trackDeepLinks: true,
  flushInterval: 10,
});

const LoggerPlugin = new Logger();

segmentClient.add({ plugin: LoggerPlugin });

FullStory.log('o-1HZPGC-na1')

FullStory.onReady().then(function (result) {
  const replayStartUrl = result.replayStartUrl;
  console.log('replayStartUrl: ', replayStartUrl);
});

segmentClient.add({
  plugin: new FullStoryPlugin({
    allowlistAllTrackEvents: true,
    enableSendScreenAsEvents: true,
    enableGroupTraitsAsUserVars: true,
  }),
});

<AnalyticsProvider client={segmentClient}></AnalyticsProvider>
*/
}


import { init } from '@amplitude/analytics-react-native';

init('5937d999b5c676f5e32554da6fa4c5fb');

export default function Main() {
    return (
        <URLStateProvider>
          <SafeAreaProvider>
            <PaperProvider>
                <App />
            </PaperProvider>
          </SafeAreaProvider>
        </URLStateProvider>  
    );
  }
  
  AppRegistry.registerComponent(appName, () => Main);
