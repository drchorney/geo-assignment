class Image < ActiveRecord::Base
  include Protectable
  attr_accessor :image_content
  attr_accessor :distance

  acts_as_mappable

  has_many :thing_images, inverse_of: :image, dependent: :destroy
  has_many :things, through: :thing_images

  # input llist of ids to exclude
  scope :exclude, -> (ids) { where.not(:id=>ids) }
  scope :include, -> (ids) { where(:id=>ids) }

  scope :with_position, ->{ all.select("images.lng, images.lat")}
  scope :within_range, ->(origin, limit=nil, reverse=nil) {
    scope=with_position
    scope=scope.within(limit,:origin=>origin)                   if limit
    scope=scope.by_distance(:origin=>origin, :reverse=>reverse) unless reverse.nil?
    return scope
  }

  def self.with_distance(origin, scope)
    scope.each {|ti| ti.distance = ti.distance_from(origin) }
  end

  composed_of :position,
              class_name:"Point",
              allow_nil: true,
              mapping: [%w(lng lng), %w(lat lat)]

  acts_as_mappable
  def to_lat_lng
    Geokit::LatLng.new(lat,lng)
  end

  def basename
    caption || "image-#{id}"
  end
end

Point.class_eval do
  def to_lat_lng
    Geokit::LatLng.new(*latlng)
  end
end
