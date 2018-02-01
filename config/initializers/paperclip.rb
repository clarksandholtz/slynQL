# taken from http://stackoverflow.com/a/21912537/1180523
# to fix error: [paperclip] Content Type Spoof: Filename uploaded_file.mp3 (["audio/mpeg"]), content type discovered from file command: application/octet-stream. See documentation to allow this combination.
require 'paperclip/media_type_spoof_detector'
module Paperclip
  class MediaTypeSpoofDetector
    def spoofed?
      false
    end
  end
end
