import { DataProviderEngine } from '@papi/backend';
import { ExecutionToken, IDataProviderEngine } from '@papi/core';
import { AquaService, IAquaService } from 'src/shared/services/aqua.service';
import type { AquaDataTypes, Results, ResultsSelector } from 'paranext-extension-dashboard';
import { UnsubscriberAsync } from 'platform-bible-utils';
import { ExtensionStoragePersist } from '../services/extension-storage.persist.service';
import { httpPapiBackRequester } from '../utils/http.papiback.requester.util';

export class AquaDataProviderEngine
  extends DataProviderEngine<AquaDataTypes>
  implements IDataProviderEngine<AquaDataTypes>, IAquaService
{
  aquaService: AquaService;

  dispose?: UnsubscriberAsync | undefined;

  onDidDispose?: undefined;

  constructor(token: ExecutionToken, prefix: string) {
    super();
    const tokens = localStorage.getItem('token');
    // const toke =
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwbGF0Zm9ybS5iaWJsZS50ZXN0IiwiaXNfYWRtaW4iOmZhbHNlLCJleHAiOjE3MTgzNzgyOTZ9.6zo31tGDC94u1VjW1tWZcA8vfOim5im6hgxCyfeWWeo';
    this.aquaService = new AquaService(
      'https://tmv9bz5v4q.us-east-1.awsapprunner.com/latest',
      {
        mode: 'no-cors',
        headers: {
          Authorization: `Bearer ${tokens}`,
        },
        // credentials: "include",
      },
      httpPapiBackRequester,
      new ExtensionStoragePersist(token, prefix),
    );

    console.log('AquaService initialized');
  }

  async getResults({ assessmentId, book, aggregateByChapter }: ResultsSelector): Promise<Results> {
    console.log('getResults called');
    const results = await this.aquaService.getResults({ assessmentId, book, aggregateByChapter });
    return results;
  }

  // eslint-disable-next-line class-methods-use-this
  async setResults() {
    return false;
  }
}
