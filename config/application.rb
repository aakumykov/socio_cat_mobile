require 'yaml'
require 'grape'
require 'fileutils'
require 'sinatra'
require 'active_record'
require 'sqlite3'
require 'paperclip'

#ActiveRecord::Base.logger = Logger.new('debug.log')
configuration = YAML::load(IO.read('config/database.yml'))
ActiveRecord::Base.establish_connection(configuration['development'])
