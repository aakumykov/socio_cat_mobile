# set :root, File.dirname(__FILE__)
# set :static, true
# set :public_folder, 'public'

class Web < Sinatra::Base
  get '/' do
  	headers['Content-Type'] = 'text/html; charset=UTF-8'
    File.read( File.join('public','mobile.html') )
  end
end