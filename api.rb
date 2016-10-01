require_relative 'model'
require 'awesome_print'

class API < Grape::API
	format :json

	helpers do
		def result_msg arg
			{ message: {
				type: arg.keys.first,
				text: arg.values.first,
			}}
		end
	end

	resource '/items' do

		# список
		get '/' do
			Item.all.map do |i|
				{
					id:i.id, 
					title:i.title, 
					content: i.content, 
					avatar:{
						thumbnail: i.avatar(:thumbnail),
						preview: i.avatar(:preview), 
						orig: i.avatar(:original),
					}
				}
			end
		end

		# просмотр
		get '/:id' do
			item = Item.find_by(id: params.id)
			{
				id: item.id,
				title: item.title,
				content: item.content,
				avatar: {
					thumbnail: item.avatar(:thumbnail),
					preview: item.avatar(:preview),
					orig: item.avatar(:original),
				}
			}
		end

		# создание
		params do
			requires :title, type: String
			requires :content, type: String
			optional :avatar, default: false
		end
		post '/new' do
			puts '------------ API:/new, params -------------'
			ap params

			puts '------------ API:/new, declared(params) -------------'
			ap declared(params)

			par = declared(params)
			
			data = {
				title: par.title,
				content: par.content,
			}
			if par.avatar then
				puts 'КАРТИНКА ЕСТЬ'
				data[:avatar] = par.avatar.tempfile
			end

			puts '------------ API:/new, data to save -------------'
			ap data

			item = Item.create(data)
			if item then
				result_msg success: "создана карточка #{item.id}"
			else
				result_msg error: "ошибка создания карточки"
			end
		end

		# правка
		get '/:id/edit' do
			item = Item.find_by(id: params.id)
			{ edit: item[:title] }
		end

		# обновление
		params do
			requires :title, type: String
			requires :content, type: String
			optional :avatar, default: false
		end
		patch '/:id' do
			puts '------------ API:/patch, params -------------'
			ap params

			puts '------------ API:/patch, declared(params) -------------'
			ap declared(params)

			par = declared(params)
			
			item = Item.find_by(id: params.id)

			data = {
				title: par.title,
				content: par.content,
			}
			if par.avatar then
				puts 'КАРТИНКА ЕСТЬ'
				item.avatar = nil
				data[:avatar] = par.avatar.tempfile
			end

			puts '------------ API:/patch, data to update -------------'
			ap data

			item.update(data)

			if item then
				result_msg success: "изменена карточка #{params.id}"
			else
				result_msg error: "ошибка изменения карточки #{params.id}"
			end
		end

		# удаление
		delete '/:id' do
			item = Item.find_by(id: params.id)
			if (item) then
				if ( item.destroy ) then
					result_msg success: "карточка #{params.id} удалена"
				else
					result_msg error: "ошибка удаления карточки #{params.id}"
				end
			else
				result_msg error: "карточки #{params.id} не существует"
			end
		end
	end
end
