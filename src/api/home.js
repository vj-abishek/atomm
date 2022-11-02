import axios from 'axios';
import {REACT_APP_YOUTUBE_URL} from '../../globals';

const url = `${REACT_APP_YOUTUBE_URL}browse`;

let continuation = null;
let itct = null;
let key = 'AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30';
let type = 'next';
let isFirst = true;

const formatData = content =>
  content.map(item => {
    // if it is banner content
    if (item?.musicImmersiveCarouselShelfRenderer) {
      isFirst = false;
      const current = item?.musicImmersiveCarouselShelfRenderer;
      return {
        type: 'musicBackground',
        title: 'bg',
        backgroundImage:
          current.backgroundImage.simpleVideoThumbnailRenderer.thumbnail
            .thumbnails[0].url,
        header: {
          title:
            current?.header?.musicCarouselShelfBasicHeaderRenderer.title
              ?.runs[0].text,
          strapline:
            current?.header?.musicCarouselShelfBasicHeaderRenderer.strapline
              ?.runs[0].text,
        },
        data: current.contents.map(cnt => {
          const contentCurrent = cnt?.musicTwoRowItemRenderer;

          return {
            aspectRatio: contentCurrent.aspectRatio,
            title: contentCurrent.title?.runs[0].text,
            subtitle: contentCurrent.subtitle.runs,
            type: contentCurrent.navigationEndpoint?.browseEndpoint
              ?.browseEndpointContextSupportedConfigs
              ?.browseEndpointContextMusicConfig.pageType,
            browseId:
              contentCurrent?.navigationEndpoint?.browseEndpoint?.browseId,
            endpoints:
              contentCurrent?.navigationEndpoint?.browseEndpoint?.browseId,
            thumbnail:
              contentCurrent.thumbnailRenderer?.musicThumbnailRenderer.thumbnail
                .thumbnails[0].url,
          };
        }),
      };
    }

    // for video content
    if (item?.musicCarouselShelfRenderer) {
      const current = item?.musicCarouselShelfRenderer;

      if ('numItemsPerColumn' in current) {
        const obj = {
          type: 'video',
          isFirst,
          title:
            current?.header.musicCarouselShelfBasicHeaderRenderer?.title
              ?.runs[0]?.text,
          data: current?.contents?.map(cnt => {
            const currentLocal = cnt?.musicResponsiveListItemRenderer;
            return {
              title:
                currentLocal?.flexColumns[0]
                  ?.musicResponsiveListItemFlexColumnRenderer.text.runs[0].text,
              subtitle:
                currentLocal?.flexColumns[1]
                  ?.musicResponsiveListItemFlexColumnRenderer?.text.runs,
              musicVideoType:
                currentLocal?.flexColumns[0]
                  ?.musicResponsiveListItemFlexColumnRenderer.text.runs[0]
                  ?.navigationEndpoint?.watchEndpoint
                  ?.watchEndpointMusicSupportedConfigs.watchEndpointMusicConfig
                  .musicVideoType,
              thumbnail:
                currentLocal?.thumbnail?.musicThumbnailRenderer?.thumbnail
                  ?.thumbnails[0].url,
              watchEndpoint:
                currentLocal?.flexColumns[0]
                  ?.musicResponsiveListItemFlexColumnRenderer?.text.runs[0]
                  ?.navigationEndpoint?.watchEndpoint,
            };
          }),
        };

        isFirst = false;

        return obj;
      }

      // album content

      const obj = {
        isFirst,
        title:
          current?.header.musicCarouselShelfBasicHeaderRenderer?.title?.runs[0]
            ?.text,
        type: 'album',
        data: current?.contents?.map(cnt => {
          return {
            title: cnt?.musicTwoRowItemRenderer?.title.runs[0].text,
            aspectRatio: cnt?.musicTwoRowItemRenderer?.aspectRatio,
            subtitle: cnt?.musicTwoRowItemRenderer?.subtitle.runs,
            type: cnt?.musicTwoRowItemRenderer?.navigationEndpoint
              ?.browseEndpoint?.browseEndpointContextSupportedConfigs
              ?.browseEndpointContextMusicConfig?.pageType,
            thumbnail:
              cnt?.musicTwoRowItemRenderer?.thumbnailRenderer
                .musicThumbnailRenderer?.thumbnail?.thumbnails[1]?.url,
            endpoints:
              cnt?.musicTwoRowItemRenderer?.navigationEndpoint?.browseEndpoint
                ?.browseId,
            browseId:
              cnt?.musicTwoRowItemRenderer?.navigationEndpoint?.browseEndpoint
                ?.browseId,
            watchEndpoint:
              cnt?.musicTwoRowItemRenderer?.navigationEndpoint?.watchEndpoint,
          };
        }),
      };

      isFirst = false;

      return obj;
    }

    return {
      data: [],
      title: '',
      index: 0,
    };
  });

export const getHome = async (
  browseId = 'FEmusic_home',
  pagination = false,
  token = null,
  refreshing = false,
) => {
  if (refreshing) {
    continuation = null;
    itct = null;
  }

  try {
    let myObj = {};

    if (!pagination) {
      myObj = {
        browseId,
      };
    }

    const params = {
      ...myObj,
      isAudioOnly: true,
      user: {
        enableSafetyMode: false,
      },
      context: {
        client: {
          clientName: 'WEB_REMIX',
          clientVersion: '0.1',
          utcOffsetMinutes: -new Date().getTimezoneOffset(),
        },
        capabilities: {},
      },
    };

    if (pagination && !continuation) {
      return [
        {
          title: 'End',
          data: [],
          index: 0,
        },
      ];
    }

    const correctURL =
      pagination && continuation
        ? `${url}?ctoken=${continuation}&continuation=${continuation}&itct=${itct}&type=${type}&key=${key}&prettyPrint=false`
        : `${url}?key=${key}`;

    const result = await axios({
      url: correctURL,
      method: 'POST',
      data: params,
      headers: {
        Host: 'music.youtube.com',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36 Edg/95.0.1020.40,gzip(gfe)',
        'Content-Type': 'application/json; charset=utf-8',
        'x-origin': 'https://music.youtube.com',
        'x-goog-visitor-id': 'Cgt3dE5kcUtFeTFvQSj5pYmbBg%3D%3D',
        Origin: 'https://music.youtube.com',
      },
      cancelToken: token,
    });

    if (result.status === 200) {
      if (
        'continuationContents' in result.data &&
        'sectionListContinuation' in result?.data?.continuationContents
      ) {
        let {contents, continuations} =
          result.data.continuationContents.sectionListContinuation;

        contents = formatData(contents);

        if (continuations && continuations[0]?.nextContinuationData) {
          const current = continuations[0].nextContinuationData;

          continuation = current.continuation;
          itct = current.clickTrackingParams;
        } else {
          return [
            {
              title: 'End',
              data: [],
              index: 0,
            },
          ];
        }

        return contents;
      }

      let {contents, continuations} =
        result.data?.contents.singleColumnBrowseResultsRenderer.tabs[0]
          .tabRenderer?.content?.sectionListRenderer;

      if (continuations && continuations[0]?.nextContinuationData) {
        const current = continuations[0].nextContinuationData;

        continuation = current.continuation;
        itct = current.clickTrackingParams;
      } else {
        // return [{
        //     title: 'end',
        //     data: [],
        // }]
      }

      if (contents) {
        contents = formatData(contents);

        return contents;
      }
    }
  } catch (err) {
    console.log('here is the error', err);
  }
};
