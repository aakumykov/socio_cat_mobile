class Avatar < ActiveRecord::Migration[5.0]
  def up
    add_attachment :items, :avatar
  end

  def down
    remove_attachment :items, :avatar
  end
end
