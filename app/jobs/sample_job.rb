class SampleJob < ApplicationJob
  queue_as :default

  def perform(*_args)
    # Do something later
    puts 'performing the sample job!'
    puts 'DONE performing the sample job!'
  end
end
