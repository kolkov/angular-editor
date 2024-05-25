import {inject, TestBed} from '@angular/core/testing';

import {AngularEditorService} from './angular-editor.service';
import {HttpClientModule} from '@angular/common/http';

describe('AngularEditorService', () => {
  let service: AngularEditorService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [AngularEditorService]
    });
    service = TestBed.inject(AngularEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#isYoutubeVideoUrl should return true for a valid Youtube URL', () => {
    const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const result = service.isYoutubeVideoUrl(videoUrl);

    expect(result).toBeTrue();
  });

  it('#isYoutubeVideoUrl should return true for a Youtube short URL', () => {
    const videoUrl = 'https://youtu.be/123ABC';
    const result = service.isYoutubeVideoUrl(videoUrl);

    expect(result).toBeTrue();
  });

  it('#isYoutubeVideoUrl should return true for an URL without a protocol', () => {
    const videoUrl = 'www.youtube.com/watch?v=123ABC';
    const result = service.isYoutubeVideoUrl(videoUrl);

    expect(result).toBeTrue();
  });

  it('#isYoutubeVideoUrl should return false for a non-Youtube URL', () => {
    const videoUrl = 'https://www.notyoutube.com/';
    const result = service.isYoutubeVideoUrl(videoUrl);

    expect(result).toBeFalse();
  });

  it('#getYoutubeVideoId should return video id from a Youtube URL', () => {
    const videoUrl = 'https://www.youtube.com/watch?v=jNQXAC9IVRw';
    const expectedId = 'jNQXAC9IVRw';

    const actualId = service.getYoutubeVideoId(videoUrl);

    expect(actualId).toBe(expectedId);
  });

  it('#getYoutubeVideoId should return video id from a Youtube short URL', () => {
    const videoUrl = 'https://youtu.be/jNQXAC9IVRw';
    const expectedId = 'jNQXAC9IVRw';

    const actualId = service.getYoutubeVideoId(videoUrl);

    expect(actualId).toBe(expectedId);
  });

 it('#getYoutubeVideoId should return video id from a Youtube URL with other query parameters', () => {
    const videoUrl = 'https://www.youtube.com/watch?v=jNQXAC9IVRw&p=abc123';
    const expectedId = 'jNQXAC9IVRw';

    const actualId = service.getYoutubeVideoId(videoUrl);

    expect(actualId).toBe(expectedId);
  });

  it('#getYoutubeVideoId should return video id from a Youtube URL ending with /', () => {
    const videoUrl = 'https://www.youtube.com/watch?v=jNQXAC9IVRw/';
    const expectedId = 'jNQXAC9IVRw';

    const actualId = service.getYoutubeVideoId(videoUrl);

    expect(actualId).toBe(expectedId);
  });

  it('#getYoutubeVideoId should return video id from a Youtube URL ending with whitespace', () => {
    const videoUrl = 'https://www.youtube.com/watch?v=jNQXAC9IVRw   ';
    const expectedId = 'jNQXAC9IVRw';

    const actualId = service.getYoutubeVideoId(videoUrl);

    expect(actualId).toBe(expectedId);
  });

  it('#getYoutubeVideoId should return video id from a Youtube short URL with query parameters', () => {
    const videoUrl = 'https://youtu.be/jNQXAC9IVRw?si=123abc&p=abc123';
    const expectedId = 'jNQXAC9IVRw';

    const actualId = service.getYoutubeVideoId(videoUrl);

    expect(actualId).toBe(expectedId);
  });

  it('#getYoutubeVideoId should return video id from a Youtube short URL ending with /', () => {
    const videoUrl = 'https://youtu.be/jNQXAC9IVRw/';
    const expectedId = 'jNQXAC9IVRw';

    const actualId = service.getYoutubeVideoId(videoUrl);

    expect(actualId).toBe(expectedId);
  });

  it('#getYoutubeVideoId should return video id from a Youtube short URL ending with whitespace', () => {
    const videoUrl = 'https://youtu.be/jNQXAC9IVRw   ';
    const expectedId = 'jNQXAC9IVRw';

    const actualId = service.getYoutubeVideoId(videoUrl);

    expect(actualId).toBe(expectedId);
  });



  it('#getYoutubeVideoId should return video id from a Youtube URL without a protocol', () => {
    const videoUrl = 'youtu.be/jNQXAC9IVRw';
    const expectedId = 'jNQXAC9IVRw';

    const actualId = service.getYoutubeVideoId(videoUrl);

    expect(actualId).toBe(expectedId);
  });

});
