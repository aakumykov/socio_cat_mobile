require 'faker'

require_relative 'config/application.rb'

ActiveRecord::Base.establish_connection(adapter:'sqlite3', database: 'db/data.sqlite3')

require_relative 'model.rb'

